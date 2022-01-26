<template>
  <div>
    <v-fab-transition origin="right top">
      <v-card class="mx-2" id="MyCard" rounded v-if="blnMounted">
<!-- ******************************************************************************************** -->
<!-- ========================================== Header ========================================== -->
<!-- ******************************************************************************************** -->
        <v-card-title>
          <v-icon left>mdi-file-cabinet</v-icon> Projects Commit
          <v-spacer></v-spacer>
<!-- ================================================================================================ -->
<!-- ========================================== Date Range ========================================== -->
<!-- ================================================================================================ -->
          <a-tooltip placement="top">
            <span slot="title">Previous 14 days</span>
            <a-icon left @click="mPrev(14,'days')" type="double-left"/>
          </a-tooltip>

          <a-tooltip placement="top">
            <span slot="title">Previous day</span>
            <a-icon class="ml-1" @click="mPrev(1,'days')" type="left"/>
          </a-tooltip>

          <v-spacer></v-spacer>
          {{moment(CalendarDate).subtract(13,'days').format('LL')}} - {{moment(CalendarDate).format('LL')}}
          <v-spacer></v-spacer>

          <a-tooltip placement="top">
            <span slot="title">Next day</span>
            <a-icon class="mr-1" @click="mNext(1,'days')" type="right"/>
          </a-tooltip>

          <a-tooltip placement="top">
            <span slot="title">Next 14 days</span>
            <a-icon @click="mNext(14,'days')" type="double-right"/>
          </a-tooltip>
          <v-spacer></v-spacer>

          <a-tooltip placement="bottom">
            <span slot="title">Daily Commits Members</span>
            <v-btn small outlined @click="$store.commit('CHANGE_sIntCommits', 1)">
              <v-icon left>mdi-account-details</v-icon>Members Commit
            </v-btn>
          </a-tooltip>
        </v-card-title>
<!-- =================================================================================================== -->
<!-- ========================================== Daily Commits ========================================== -->
<!-- =================================================================================================== -->
        <v-divider></v-divider>
        <v-card-text class="py-0">
          <v-row justify="space-around" align="center">
            <v-col cols="2">
              <v-select clearable :items="objSections" v-model="strFilterSections" item-text="SectionName" item-value="SectionID" label="Filter Section" dense outlined hide-details @change="mChangeFilter(),strFilterTeams=''"></v-select>
            </v-col>

            <v-col cols="2">
              <v-select clearable :items="filteredTeam" v-model="strFilterTeams" item-text="TeamName" item-value="TeamID" label="Filter Team" dense outlined hide-details @change="mChangeFilter()"></v-select>
            </v-col>

            <v-col cols="4">
              <v-text-field placeholder="Search Projects" outlined v-model="strSearch" dense append-icon="mdi-magnify" hide-details @input="mChangeFilter()"></v-text-field>
            </v-col>

            <v-col cols="4" align="right">
              <a-tooltip placement="bottom" title="Save Commit">
                <v-btn outlined v-if="blnAdministrator" @click="mSaveCommit()">
                  <v-icon left>mdi-content-save</v-icon>Save
                </v-btn>
              </a-tooltip>
            </v-col>
          </v-row>

          <div id="MyTable">
            <v-simple-table dense fixed-header>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-center" id="MyBorder">SECTION</th>
                    <th class="text-center" id="MyBorder">TEAM</th>
                    <th class="text-center" id="MyBorder">PROJECTS</th>
                    <th v-for="i in cObjHeader" :key="i.day" class="text-center" id="MyBorder" :style="`${mGetDayColor(i.day)}`">
                      <a-tooltip placement="top" :title="moment(i.day).format('MMMM YYYY')">
                        {{moment(i.day).format("ddd DD")}}
                      </a-tooltip>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in cPaginatedData" :key="item.ID">
                    <td class="text-center" id="MyBorder">{{mGetSectionName(item.SectionID)}}</td>

                    <td class="text-center" id="MyBorder">{{mGetTeamName(item)}}</td>

                    <td class="text-left" id="MyBorder">
                      <v-list-item class="pa-0">
                        <v-list-item-avatar tile>
                          <a-avatar shape="square" :src="item.Avatar">
                            {{ item.Name.substring(0, 1).toUpperCase()}}
                          </a-avatar>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <a-tooltip placement="right" title="Open  Project">
                            <a target="_blank" :href="mgetProjectUrl(item.Gitlab_ID)">{{item.Name}}</a>
                          </a-tooltip>
                        </v-list-item-content>
                      </v-list-item>
                    </td>

                    <td class="text-center" id="MyBorder" v-for="i in cObjHeader" :key="i.day" :style="`${mGetDayColorCell(item.Gitlab_ID,i.day)}`">
                      <div v-if="moment(ToDay).format('YYYYMMDD')>=moment(i.day).format('YYYYMMDD')">
                        <div v-if="mCheckCommits(item.Gitlab_ID,i.day)">
                          <a-icon v-if="moment(ToDay).format('YYYYMMDD')>moment(i.day).format('YYYYMMDD')" type="check-circle" theme="twoTone" two-tone-color="green" :style="`fontSize:${moment(ToDay).subtract(moment(ToDay).subtract(1,'days').format('dddd')=='Sunday'? 2:1,'days').format('YYYYMMDD')==moment(i.day).format('YYYYMMDD')? '20':'15'}px`"/>
                          <a-icon v-else type="check-circle" theme="twoTone" two-tone-color="#BEFDEE" style="fontSize:20px"/>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <a-empty v-if="cPaginatedData.length==0" class="mt-10"></a-empty>
          </div>

          <v-divider></v-divider>
          <div class="mt-2">
            <v-row no-gutters justify="space-around">
              <v-col cols="auto" align="center">
                <v-row id="MyBorder" no-gutters justify="center" class="pa-2">
                  <v-col cols="auto" align="center">
                    <v-btn dense small text>
                      <a-avatar class="mr-1" shape="square" size="small" :style="{ backgroundColor: '#EF9A9A', verticalAlign: 'middle' }"></a-avatar>No Commit
                    </v-btn>
                  </v-col>

                  <v-col cols="auto" align="center">
                    <v-btn dense small text>
                      <a-icon class="mr-1" type="check-circle" theme="twoTone" two-tone-color="green" style="fontSize:15px"/>Commited
                    </v-btn>
                  </v-col>

                  <v-col cols="auto" align="center">
                    <v-btn dense small text>
                      <a-icon class="mr-1" type="check-circle" theme="twoTone" two-tone-color="green" style="fontSize:20px"/>Yesterday's Commit
                    </v-btn>
                  </v-col>

                  <v-col cols="auto" align="center">
                    <v-btn dense small text>
                      <a-icon class="mr-1" type="check-circle" theme="twoTone" two-tone-color="#BEFDEE" style="fontSize:20px"/>Today's Commit
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="auto" align="center">
                <v-pagination dense circle v-model="intPageNo" :length="cPageCount" :total-visible="5" prev-icon="mdi-menu-left" next-icon="mdi-menu-right"></v-pagination>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>
    </v-fab-transition>

    <a-modal v-model="blnViewCommits" title="Project Commits" centered :footer="null">
      <a-list v-if="objCommitsInfo.length != 0" size="small" item-layout="horizontal" :data-source="objCommitsInfo" bordered :pagination="{pageSize: 5}">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-list-item-meta>
            <a-avatar slot="avatar" size="large" class="mt-1" :src="mFindMemberAvatar(item.author_email)" shape="square">
              {{ item.author_name.substring(0, 1).toUpperCase()}}
            </a-avatar>

            <span slot="title">
              {{item.title}}
            </span>

            <span slot="description">
              <a target="_blank" :href="mFindMemberUrl(item.author_email)">{{mFindMemberName(item.author_email,item.author_name)}}</a>
              authored
              <a-tooltip placement="top" :title="moment(item.created_at).format('LLL')">
                {{moment(item.created_at).fromNow()}}
              </a-tooltip>
            </span>
          </a-list-item-meta>

          <span slot="extra">
            {{moment(item.created_at).format('LL')}}
          </span>
        </a-list-item>
      </a-list>
    </a-modal>
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
        blnViewCommits: false,

        ToDay: "",
        CalendarDate: "",
        strSearch: "",
        strFilterSections: "",
        strFilterTeams: "",
        strNoDataImage: Empty.PRESENTED_IMAGE_SIMPLE,
        
        intPageNo: 1,
        intRowNo: 10,

        objSections: [],
        objTeams: [],
        objProjects: [],
        objCommits: [],
        objGitlab_Projects: [],
        objData: [],
        objUsers: [],
        objCommitsInfo: [],
      }
    },
// ********************************************************************************** //
// ===================================== Mounted ==================================== //
// ********************************************************************************** //
    mounted(){
      this.blnMounted = true
    },
// ********************************************************************************** //
// ===================================== Created ==================================== //
// ********************************************************************************** //
    created(){
      this.$notification.config({ placement: "bottomRight", duration: 3 })
      this.ToDay = new Date()
      this.CalendarDate = new Date()
      this.mGetUsers()
      this.mGetData()
      this.mGetProjects()
      this.mGetGitlab_Projects()
      this.mGetSections()
      this.mGetTeams()
    },
// *********************************************************************************** //
// ===================================== Computed ==================================== //
// *********************************************************************************** //
    computed:{
      filteredSearch(){
        let data = this.objGitlab_Projects.filter(rec => {
          return rec.Name.toUpperCase().includes(this.strSearch.toUpperCase())
        })
        if(this.strFilterSections != "" && this.strFilterSections != undefined){
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
      filteredTeam(){
        let data = this.objTeams
        if(this.strFilterSections != "" && this.strFilterSections != undefined){
          data = data.filter(rec => {
            return rec.SectionID == this.strFilterSections
          })
        }
        return data
      },
      cPageCount(){
        let l = this.filteredSearch.length
        let s = this.intRowNo
        return Math.ceil(l / s)
      },
      cPaginatedData(){
        const start = (this.intPageNo - 1) * this.intRowNo
        const end = start + this.intRowNo
        return this.filteredSearch.slice(start, end)
      },
      cObjHeader(){
        const obj = []
        const daystart = moment(this.CalendarDate).subtract(13, "days")
        for(let a = 0; a < 14; a++){
          const data = { day: moment(daystart).add(a, "days").format() }
          obj.push(data)
        }
        return obj
      },
      cEndOfMonth(){
        return moment(this.CalendarDate).endOf("month").format("DD")
      },
      cDayStart(){
        return moment(this.CalendarDate).startOf("month")
      },
      cDayEnd(){
        return moment(this.CalendarDate).endOf("month")
      }
    },
// ********************************************************************************** //
// ===================================== Methods ==================================== //
// ********************************************************************************** //
    methods:{
      moment,
      mGetUsers(){
        let url = `${this.api}/Gitlab_User`
        axios.get(url).then(res => {
          this.objUsers = res.data
        })
      },
      mChangeFilter(){
        this.intPageNo = 1
      },
      mFindMemberUrl(email){
        let find = this.objUsers.find(rec => {
          return rec.Email == email
        })
        if(find != undefined){
          return `${this.$store.state.gitlab_api}/${find.UserName}`
        }
        else{
          return ""
        }
      },
      mFindMemberName(email,name){
        let find = this.objUsers.find(rec => {
          return rec.Email == email
        })
        if(find != undefined){
          return find.Name
        }
        else{
          return name
        }
      },
      mFindMemberAvatar(email){
        let find = this.objUsers.find(rec => {
          return rec.Email == email
        })
        if(find != undefined){
          return find.Avatar
        }
        else{
          return ""
        }
      },
      mGetData(){
        let url = `${this.api}/Gitlab_Projects_Commit`
        axios.get(url).then(res => {
          this.objData = res.data
        })
      },
      mGetGitlab_Projects(){
        let url = `${this.api}/Gitlab_Projects`
        axios.get(url).then(res => {
          this.objGitlab_Projects = res.data
        })
      },
      mgetProjectUrl(id){
        if(id != null || id != undefined){
          let data = this.objProjects.find(rec => {
            return rec.id == id
          })
          if(data != undefined){
            return data.web_url
          }
          else{
            return ""
          }
        }
      },
      mGetSectionName(id){
        if(id != null || id != undefined){
          let data = this.objSections.find(rec => {
            return rec.SectionID == id
          })
          if(data != undefined){
            return data.SectionName
          }
          else{
            return ""
          }
        }
      },
      mGetTeamName(val){
        if(val != null || val != undefined){
          let data = this.objTeams.find(rec => {
            return rec.TeamID == val.TeamID && rec.SectionID == val.SectionID
          })
          if(data != undefined){
            return data.TeamName
          }
          else{
            return ""
          }
        }
      },
      mNext(day,type){
        this.CalendarDate = moment(this.CalendarDate).add(day,type)
      },
      mPrev(day,type){
        this.CalendarDate = moment(this.CalendarDate).subtract(day,type)
      },
      mGetDayColor(day){
        let theDate = moment(day).format("dddd")
        let DDformat = moment(day).format("YYYYMMDD")
        let ToDate = moment(this.ToDay).format("YYYYMMDD")
        if(DDformat == ToDate){
          return "color:blue;font-size:15px"
        }
        else if(theDate == "Sunday"){
          return "background-color:grey;color:white"
        }
        else{
          return ""
        }
      },
      mGetDayColorCell(id,day){
        let theDate = moment(day).format("dddd")
        let DDformat = moment(day).format("YYYYMMDD")
        let ToDate = moment(this.ToDay).format("YYYYMMDD")
        if(this.mCheckCommits(id,day) == false){
          if(theDate == "Sunday"){
            return "background-color:grey"
          }
          else if(DDformat < ToDate){
            return "background-color:#EF9A9A"
          }
          else{
            return ""
          }
        }
        else{
          return ""
        }
      },
      mSaveCommit(){
        const mapCommits = this.objCommits.map(rec => {
          let myData = { Gitlab_ID: rec.id, Date: rec.Date, Column: `bln_${Number(moment(rec.Date).format("DD"))}` }
          return myData
        })
        for(let b = 0; b < mapCommits.length; b++){
          let com = mapCommits[b]
          let MM = Number(moment(com.Date).format("MM"))
          let YYYY = Number(moment(com.Date).format("YYYY"))
          let data = { Gitlab_ID: com.Gitlab_ID, Column: com.Column, Gitlab_MM: MM, Gitlab_YYYY: YYYY }
          let url = `${this.api}/Gitlab_Projects_CommitUpdate`
          axios.post(url, data).then(res => {
            let ret = res.data
            if(ret.Gitlab_ID != data.Gitlab_ID){
              console.log(res.data)
              // console.log(data)
            }
          })
        }
        const daystart = moment(this.ToDay).subtract(this.sIntGetCommits, "days").format("YYYY-MM-DD")
        const dayend = moment(this.ToDay).format("YYYY-MM-DD")
        this.$notification.success({ message: "Gitlab Monitoring", description: `Successfully save commits from ${daystart} to ${dayend}` })
        this.mGetData()
      },
      mCheckCommits(id,day){
        let toReturn = false
        const theDate = moment(day).format("MMDDYYYY")
        const MM = moment(day).format("MM")
        const YYYY = moment(day).format("YYYY")
        const SaveCommits = this.objData.find(rec => {
          return(rec.Gitlab_ID == id && rec.Gitlab_MM == MM && rec.Gitlab_YYYY == YYYY)
        })
        const objCommitDay = this.objCommits.filter(rec => {
          return rec.id == id && moment(rec.Date).format("MMDDYYYY") == theDate
        })
        if(SaveCommits != undefined){
          toReturn = SaveCommits[`Bln_${Number(moment(day).format("DD"))}`]
        }
        if(toReturn == false || toReturn == null){
          toReturn = objCommitDay.length != 0
        }
        return toReturn
      },
      mGetCommitsInfo(id,day){
        this.objCommitsInfo = []
        this.blnViewCommits = true
        const daystart = moment(day).subtract(1, "days").format("YYYY-MM-DD") + "T23:59:00Z"
        const dayend = moment(day).add(1, "days").format("YYYY-MM-DD") + "T00:00:00Z"
        let url = `${this.$store.state.gitlab_api}/api/v4/projects/${id}/repository/commits?private_token=mxus9a5iYWGjkw_TqTsD&since=${daystart}&until=${dayend}&page=1&per_page=100&all=true`
        axios.get(url).then(res => {
          this.objCommitsInfo = res.data
        })
      },
      mGetProjects(){
        this.objProjects = []
        const me = this
        async function getall(){
          for(let a = 1; a < 100; a++){
            let url = `${this.$store.state.gitlab_api}/api/v4/projects?private_token=mxus9a5iYWGjkw_TqTsD&active=true&page=${a}&per_page=100&order_by=name&sort=asc`
            await axios.get(url).then(res => {
              me.mGetAllProjects(res.data)
              me.mGetCommits(res.data)
              if(res.data.length < 100){
                a = 100
              }
            })
          }
        }
        getall()
      },
      mGetCommits(value){
        const daystart = moment(this.CalendarDate).subtract(this.sIntGetCommits, "days").format("YYYY-MM-DD") + "T00:00:00Z"
        const dayend = moment(this.CalendarDate).add(1, "days").format("YYYY-MM-DD") + "T00:00:00Z"
        const me = this
        getall()
        async function getall(){
          for(let b = 0; b < value.length; b++){
            const id = value[b].id
            for(let a = 1; a < 10; a++){
              let url = `${this.$store.state.gitlab_api}/api/v4/projects/${id}/repository/commits?private_token=mxus9a5iYWGjkw_TqTsD&since=${daystart}&until=${dayend}&page=${a}&per_page=100&all=true`
              await axios.get(url).then(res => {
                let data = res.data.map(rec => {
                  let myData = { id: id, Date: rec.committed_date }
                  return myData
                })
                me.mGetAllCommits(data)
                if(res.data.length < 100){
                  a = 10
                }
              })
            }
          }
        }
      },
      mGetSections(){
        let url = `${this.api}/Sections`
        axios.get(url).then(res => {
          this.objSections = res.data
        })
      },
      mGetTeams(){
        let url = `${this.api}/Teams`
        axios.get(url).then(res => {
          this.objTeams = res.data
        })
      },
      mGetAllProjects(data){
        this.objProjects = this.objProjects.concat(data)
      },
      mGetAllCommits(data){
        this.objCommits = this.objCommits.concat(data)
      }
    }
  }
</script>
<!-- ============================================================================================== -->
<!-- =========================================== Styles =========================================== -->
<!-- ============================================================================================== -->
<style >
  #MyBorder{
    border: 1px solid #e0e0e0;
  }

  #MyTable{
    max-height: calc(100vh - 270px);
    min-height: calc(100vh - 270px);
    overflow-y: auto;
    overflow-x: auto;
  }

  #MyTableDialog{
    max-height: calc(100vh - 210px);
    min-height: calc(100vh - 210px);
    overflow-y: auto;
    overflow-x: auto;
  }
</style>