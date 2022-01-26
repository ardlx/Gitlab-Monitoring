<template>
  <div>
<!-- ******************************************************************************************** -->
<!-- ====================================== 403 Not Allowed ===================================== -->
<!-- ******************************************************************************************** -->
    <a-result v-if="!blnAdministrator" status="403" title="403" sub-title="Sorry, you are not authorized to access this page.">
      <template #extra>
        <a-button @click="mChangeRouter('/')" type="primary">Back Home</a-button>
      </template>
    </a-result>
<!-- ******************************************************************************************** -->
<!-- ====================================== 404 Not Found ======================================= -->
<!-- ******************************************************************************************** -->
    <a-result v-else-if="blnURLFound" status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
      <template #extra>
        <a-button @click="mChangeRouter('/Member')" type="primary">Back Home</a-button>
      </template>
    </a-result>
<!-- ******************************************************************************************** -->
<!-- ========================================== Header ========================================== -->
<!-- ******************************************************************************************** -->
    <v-row v-else no-gutters>
      <v-col cols="6">
        <v-scale-transition origin="top left">
          <v-card class="mx-2" id="MyCard" tile v-if="blnMounted">
            <v-card-title>
              <v-icon left>mdi-account-details</v-icon>Member List
            </v-card-title>

            <v-divider></v-divider>
            <v-card-text class="py-0">
              <v-row justify="space-around" align="center">
                <v-col cols="4">
                  <a-select showSearch :filter-option="filterOption" allowClear v-model="strFilterSections" placeholder="Section" @change="mChangeSearch()" style="width:100%" size="large">
                    <a-select-option v-for="item in objSections" :key="item.SectionID" :value="item.SectionID">
                      {{item.SectionName}}
                    </a-select-option>
                  </a-select>
                </v-col>

                <v-col cols="4">
                  <a-select showSearch :filter-option="filterOption" allowClear v-model="strFilterTeams" placeholder="Team" @change="mChangeSearch()" style="width:100%" size="large">
                    <a-select-option v-for="item in filteredTeamU" :key="item.TeamID" :value="item.TeamID">
                      {{item.TeamName}}
                    </a-select-option>
                  </a-select>
                </v-col>

                <v-col cols="4">
                  <a-input-search allowClear size="large" v-model="strSearch" placeholder="Search Members" @input="mChangeSearch()"/>
                </v-col>
              </v-row>
<!-- ******************************************************************************************** -->
<!-- ================================== Members List ============================================ -->
<!-- ******************************************************************************************** -->
              <a-list :loading="blnLoading" id="MyDiv2M" size="small" item-layout="horizontal" :data-source="filteredSearch" bordered>
                <a-list-item :id="mChangeSpace(item.Name)" slot="renderItem" slot-scope="item" :style="`background-color:${objInfo.ID==item.ID?'#90CAF9':''}`">
                  <a-list-item-meta @click="mModifyMember(item)">
                    <a-avatar slot="avatar" size="large" class="mt-1" shape="square" :src="item.Avatar">
                      {{ item.Name.substring(0, 1).toUpperCase()}}
                    </a-avatar>

                    <span slot="title">
                      <a-tooltip placement="right" title="Double click to open member's GitLab profile">
                        <a @dblclick="mOpenURL(`${$store.state.gitlab_api}/${item.UserName}`)" style="font-size:17px;color;text-decoration: underline;">
                          {{item.Name}}
                        </a>
                      </a-tooltip>
                    </span>

                    <span slot="description">
                      Section :
                      <span class="black--text">{{mGetSectionName(item.SectionID)}}</span>
                      {{' | '}}
                      Team :
                      <span class="black--text">{{mGetTeamName(item)}}</span>
                    </span>
                  </a-list-item-meta>

                  <div slot="extra">
                    <a-switch v-model="item.BlnInclude" :disabled="mGetSectionName(item.SectionID)=='' || mGetTeamName(item)==''" @change="mUpdateMember(item)">
                      <span slot="checkedChildren">Show</span>
                      <span slot="unCheckedChildren">Hidden</span>
                    </a-switch>
                  </div>
                </a-list-item>
              </a-list>
            </v-card-text>
          </v-card>
        </v-scale-transition>
      </v-col>
<!-- ******************************************************************************************** -->
<!-- ================================== Informations ============================================ -->
<!-- ******************************************************************************************** -->
      <v-col cols="6">
        <v-scale-transition origin="bottom right">
          <v-card class="mx-2" id="MyCard" tile v-if="blnMounted">
            <v-card-title>
              <v-icon left>mdi-information-variant</v-icon>Informations
              <v-spacer></v-spacer>

              <a-tooltip placement="left">
                <span v-if="objInfo.Avatar!=objInfoGitlab.avatar_url" slot="title">
                  Replace with avatar on Gitlab
                </span>

                <span v-else slot="title">Member Avatar</span>

                <a-avatar v-if="objInfo.Avatar != objInfoGitlab.avatar_url" shape="square" size="large" icon="user" :src="objInfo.Avatar" @click="objInfo.Avatar=objInfoGitlab.avatar_url"/>
                <a-avatar v-else shape="square" size="large" icon="user" :src="objInfo.Avatar" />
              </a-tooltip>
            </v-card-title>

            <v-card-text>
              <a-form layout="inline" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                <a-form-item labelAlign="left" label="Gitlab ID" style="width:100%">
                  <a-input disabled v-model="objInfo.ID" />
                </a-form-item>
                
                <a-form-item labelAlign="left" label="Employee Code" style="width:100%">
                  <a-input v-model="objInfo.EmployeeCode" />
                </a-form-item>

                <a-form-item labelAlign="left" label="Section" required style="width:100%">
                  <a-select v-model="objInfo.SectionID" allowClear @change="objInfo.TeamID=''">
                    <a-select-option v-for="i in objSections" :key="i.SectionID" :value="i.SectionID">
                      {{i.SectionName}}
                    </a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item labelAlign="left" label="Team" style="width:100%">
                  <a-select v-model="objInfo.TeamID" allowClear>
                    <a-select-option v-for="i in filteredTeam" :key="i.TeamID" :value="i.TeamID">
                      {{i.TeamName}}
                    </a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item labelAlign="left" label="Gitlab Name" required style="width:100%">
                  <a-input v-model="objInfo.Name">
                    <a-tooltip slot="suffix" title="Replace with name on Gitlab">
                      <a-icon v-if="objInfo.Name != objInfoGitlab.name" type="info-circle" @click="objInfo.Name=objInfoGitlab.name"/>
                    </a-tooltip>
                  </a-input>
                </a-form-item>

                <a-form-item labelAlign="left" label="Gitlab Username" required style="width:100%">
                  <a-input v-model="objInfo.UserName">
                    <a-tooltip slot="suffix" title="Replace with username on Gitlab">
                      <a-icon v-if="objInfo.UserName != objInfoGitlab.username" type="info-circle" @click="objInfo.UserName=objInfoGitlab.username"/>
                    </a-tooltip>
                  </a-input>
                </a-form-item>

                <a-form-item labelAlign="left" label="Gitlab Email" required style="width:100%">
                  <a-input v-model="objInfo.Email">
                    <a-tooltip slot="suffix" title="Replace with email on Gitlab">
                      <a-icon v-if="objInfoGitlab.email != objInfo.Email" type="info-circle" @click="objInfo.Email=objInfoGitlab.email"/>
                    </a-tooltip>
                  </a-input>
                </a-form-item>

                <a-form-item :wrapper-col="{ span: 24 }" style="width:100%">
                  <v-row no-gutters>
                    <v-col align="right">
                      <a-button block icon="save" @click="mUpdateMember(objInfo)" type="primary" :loading="blnLoading" :disabled="cCheckEdit">
                        Save
                      </a-button>
                    </v-col>
                  </v-row>
                </a-form-item>
              </a-form>
            </v-card-text>
<!-- =================================================================================================== -->
<!-- ================================== GitLab Informations ============================================ -->
<!-- =================================================================================================== -->
            <v-card-title>
              <v-icon left>mdi-gitlab</v-icon>Gitlab User Informations
              <v-spacer></v-spacer>
            </v-card-title>

            <v-card-text>
              <a-descriptions :column="2" size="small" v-if="objInfoGitlab.length!=0 ">
                <a-descriptions-item label="Gitlab User ID">{{objInfoGitlab.id}}</a-descriptions-item>

                <a-descriptions-item label="Status">
                  <a-badge :status="objInfoGitlab.state=='active'?'processing' : 'error'" :text="objInfoGitlab.state"/>
                </a-descriptions-item>

                <a-descriptions-item label="Name">{{ objInfoGitlab.name}}</a-descriptions-item>

                <a-descriptions-item label="Username">{{ objInfoGitlab.username}}</a-descriptions-item>

                <a-descriptions-item label="Email">{{ objInfoGitlab.email}}</a-descriptions-item>

                <a-descriptions-item label="Member Since">
                  {{moment(objInfoGitlab.created_at).format('YYYY-MM-DD')}} ({{moment(objInfoGitlab.created_at).fromNow()}})
                </a-descriptions-item>

                <a-descriptions-item label="Confirm at">
                  {{moment(objInfoGitlab.confirmed_at).format('YYYY-MM-DD')}} ({{moment(objInfoGitlab.confirmed_at).fromNow()}})
                </a-descriptions-item>

                <a-descriptions-item label="Current Sign In">
                  {{moment(objInfoGitlab.current_sign_in_at).format('YYYY-MM-DD')}} ({{moment(objInfoGitlab.current_sign_in_at).fromNow()}})
                </a-descriptions-item>
              </a-descriptions>
            </v-card-text>
<!-- ============================================================================================ -->
<!-- ==================================== Projects ============================================== -->
<!-- ============================================================================================ -->
            <v-card-title>
              <v-icon left>mdi-file</v-icon>Projects ({{objUserProjects.length}})
            </v-card-title>

            <v-card-text>
              <a-list size="small" item-layout="horizontal" :data-source="objUserProjects" bordered :pagination="{pageSize: 5,showLessItems:true}">
                <a-list-item slot="renderItem" slot-scope="item">
                  <a-list-item-meta>
                    <a-avatar slot="avatar" size="large" class="mt-1" :src="item.avatar_url" shape="square">{{ item.name.substring(0, 1).toUpperCase()}}</a-avatar>

                    <span slot="title">
                      <a-tooltip placement="right" title="Double click to open project infromations.">
                        <a @dblclick="mOpenURL(item.web_url)" style="text-decoration: underline;">{{item.name}}</a>
                      </a-tooltip>
                    </span>

                    <span slot="description">
                      Gitlab ID :
                      <span class="black--text">
                        {{item.id}}
                      </span>
                    </span>
                  </a-list-item-meta>

                  <span slot="extra">{{moment(item.created_at).format('YYYY-MM-DD')}}</span>
                </a-list-item>
              </a-list>
            </v-card-text>
          </v-card>
        </v-scale-transition>
      </v-col>
    </v-row>
  </div>
</template>
<!-- ============================================================================================== -->
<!-- ========================================== Scripts =========================================== -->
<!-- ============================================================================================== -->
<script>
  import { Empty } from "ant-design-vue"
  import axios from "axios"
  import moment from "moment"
  export default {
// ******************************************************************************* //
// ===================================== Data ==================================== //
// ******************************************************************************* //
    data(){
      return{
        blnMounted: false,
        blnURLFound: false,
        blnFirstLoad: true,
        EBlnInclude: false,
        blnLoading: false,

        strSearch: undefined,
        strFilterSections: undefined,
        strFilterTeams: undefined,
        strNoDataImage: Empty.PRESENTED_IMAGE_SIMPLE,

        objInfo: [],
        objInfoGitlab: [],
        objSections: [],
        objTeams: [],
        objUsers: [],
        objUserProjects: []
      }
    },
// ********************************************************************************** //
// ===================================== Mounted ==================================== //
// ********************************************************************************** //
    mounted(){
      this.blnMounted = true
    },
// ********************************************************************************** //
// ===================================== Updated ==================================== //
// ********************************************************************************** //
    updated(){
      if(this.blnFirstLoad == true && this.objInfo.Name != undefined){
        let el = this.mChangeSpace(this.objInfo.Name)
        this.$scrollTo(`#${el}`, {
          container: "#MyDiv2M"
        })
        this.blnFirstLoad = false
      }
    },
// ********************************************************************************** //
// ===================================== Created ==================================== //
// ********************************************************************************** //
    created(){
      this.strSearch = this.$route.query.search
      this.mGetUsers()
      this.mGetSections()
      this.mGetTeams()
      this.mGetUsersNew()
    },
// *********************************************************************************** //
// ===================================== Computed ==================================== //
// *********************************************************************************** //
    computed:{
      filteredSearch(){
        let data = this.objUsers
        if(this.strSearch != undefined){
          data = data.filter(rec => {
            return rec.Name.toUpperCase().includes(this.strSearch.toUpperCase())
          })
        }
        if(this.strFilterSections != undefined){
          data = data.filter(rec => {
            return rec.SectionID == this.strFilterSections
          })
        }
        if(this.strFilterTeams != "" && this.strFilterTeams != undefined){
          data = data.filter(rec => {
            return rec.TeamID == this.strFilterTeams
          })
        }
        return data
      },
      filteredTeamU(){
        let data = this.objTeams
        if(this.strFilterSections != undefined){
          data = data.filter(rec => {
            return rec.SectionID == this.strFilterSections
          })
        }
        return data
      },
      filteredTeam(){
        let data = this.objTeams
        if(this.objInfo.SectionID != undefined){
          data = data.filter(rec => {
            return rec.SectionID == this.objInfo.SectionID
          })
        }
        return data
      },
      cCheckEdit(){
        let val = false
        if(this.objInfo.SectionID == undefined){
          val = true
        }
        if(this.objInfo.Name == "" || this.objInfo.Name == undefined){
          val = true
        }
        if(this.objInfo.UserName == "" || this.objInfo.UserName == undefined){
          val = true
        }
        if(this.objInfo.Email == "" || this.objInfo.Email == undefined){
          val = true
        }
        return val
      }
    },
// ********************************************************************************** //
// ===================================== Methods ==================================== //
// ********************************************************************************** //
    methods:{
      moment,
      filterOption(input,option){
        return(option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
      },
      mChangeSpace(el){
        let data = el
        data = data.replace(".", "")
        data = data.replace(",", "")
        data = data.replace(/ /gi, "")
        return data
      },
      mChangeRouter(routes){
        this.$router.push(routes)
        location.reload()
      },
      mChangeSearch(){
        if(this.strSearch == ""){
          this.strSearch = undefined
        }
        if(this.filteredSearch.length != 0){
          this.mModifyMember(this.filteredSearch[0])
        }
      },
      mChangeSearchParams(qparams){
        let data = this.objUsers.filter(rec => {
          return this.mChangeSpace(rec.Name).toUpperCase().includes(qparams.toUpperCase())
        })
        if(data.length != 0){
          this.mModifyMember(data[0])
        }
        else{
          this.blnURLFound = true
        }
      },
      mOpenURL(href){
        window.open(href, "_blank")
      },
      mErrorAvatar(event){
        event.target.src = "https://www.gravatar.com/avatar/562c15271b165a74e6cd418b19138692?s=80&d=identicon"
      },
      mSaveNewUser(value){
        for(let a = 0; a < value.length; a++){
          const data = { ID: value[a].id, Name: value[a].name, UserName: value[a].username, Email: value[a].email, Avatar: value[a].avatar_url, UserRights: 1, BlnInclude: 0, UpdatedDate: this.dtDateNow, UpdatedByUserID: this.intAdministratorID }
          const already = this.objUsers.find(rec => {
            return rec.ID == data.ID
          })
          if(already == undefined && this.objUsers.length != 0){
            let url = `${this.api}/Gitlab_UserInsert`
            axios.post(url, data).then(res => {
              console.log(res.data)
              this.$notification.success({ message: "Gitlab Monitoring", description: `New Member Added ID=${data.ID} Name = ${data.Name}`, duration: null })
            })
            this.mUpdateMember(data)
          }
        }
      },
      mModifyMember(data){
        let ID = data.ID
        let url = `${this.api}/Gitlab_UserInfo/${ID}`
        axios.get(url).then(res => {
          this.objInfo = res.data[0]
        })
        axios.get(`${this.$store.state.gitlab_api}/api/v4/users/${ID}/projects?private_token=mxus9a5iYWGjkw_TqTsD`).then(res => {
          this.objUserProjects = res.data
        })
        axios.get(`${this.$store.state.gitlab_api}/api/v4/users/${ID}?private_token=mxus9a5iYWGjkw_TqTsD`).then(res => {
          this.objInfoGitlab = res.data
        })
        let query = {}
        if(this.strSearch != undefined){
          query = { name: this.mChangeSpace(data.Name), search: this.strSearch }
        }
        else{
          query = { name: this.mChangeSpace(data.Name) }
        }
        if(this.$router.app._route.query.name != query.name || this.$router.app._route.query.search != query.search){
          this.$router.push({
            path: "/Member",
            query: query
          })
        }
      },
      mUpdateMember(data){
        data.UpdatedDate = this.dtDateNow
        data.UpdatedByUserID = this.intAdministratorID
        this.blnLoading = true
        let url = `${this.api}/Gitlab_UserUpdate`
        axios.post(url, data).then(res => {
          console.log(res.data)
          this.$notification.success({ message: "Member Maintenance", description: "Successfully updated member."})
        })
        .finally(() => {
          location.reload()
          this.blnLoading = false
        })
        this.$router.push({
          path: "/Member",
          query: { name: this.mChangeSpace(data.Name), search: this.strSearch }
        })
      },
      mGetSectionName(id){
        let data = this.objSections.find(rec => {
          return rec.SectionID == id
        })
        if(data != undefined){
          return data.SectionName
        }
        else{
          return ""
        }
      },
      mGetTeamName(val){
        let data = this.objTeams.find(rec => {
          return rec.TeamID == val.TeamID && rec.SectionID == val.SectionID
        })
        if(data != undefined){
          return data.TeamName
        }
        else{
          return ""
        }
      },
      mGetUsers(){
        let url = `${this.api}/Gitlab_User`
        axios.get(url).then(res => {
          this.objUsers = res.data
          let qparamsName = this.$route.query.name
          if(qparamsName != undefined){
            this.mChangeSearchParams(qparamsName)
          }
          else{
            this.mChangeSearch()
          }
        })
        .catch(err => {
          console.log(err)
          console.log(url)
        })
      },
      mGetSections(){
        let url = `${this.api}/Sections`
        axios.get(url).then(res => {
          this.objSections = res.data
        })
        .catch(err => {
          console.log(err)
          console.log(url)
        })
      },
      mGetTeams(){
        let url = `${this.api}/Teams`
        axios.get(url).then(res => {
          this.objTeams = res.data
        })
        .catch(err => {
          console.log(err)
          console.log(url)
        })
      },
      mGetUsersNew(){
        for(let a = 1; a < 100; a++){
          let url = `${this.$store.state.gitlab_api}/api/v4/users?private_token=mxus9a5iYWGjkw_TqTsD&active=true&page=${a}&per_page=100`
          axios.get(url).then(res => {
            this.mSaveNewUser(res.data)
            if(res.data.length < 100){
              a = 100
            }
          })
          .catch(err => {
            console.log(err)
            console.log(url)
          })
        }
      }
    }
  }
</script>
<!-- ============================================================================================== -->
<!-- =========================================== Styles =========================================== -->
<!-- ============================================================================================== -->
<style>
  #MyBorder{
    border: 1px solid #e0e0e0;
  }

  #MyDiv2M{
    max-height: calc(100vh - 200px);
    min-height: calc(100vh - 200px);
    overflow-y: auto;
    overflow-x: auto;
  }

  #MyDiv2M .ant-list-item:hover{
    background-color: #eeeeea;
    cursor: pointer;
  }

  .v-application ul, .v-application ol{
    padding-left: 0px;
  }
</style>