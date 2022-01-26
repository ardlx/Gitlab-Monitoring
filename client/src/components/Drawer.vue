<template>
  <div>
    <v-app-bar dense clipped-left color="transparent" app>
      <a-tooltip placement="right" :title="sBlnDrawer ? 'Show Menu Details' : 'Hide Menu Details'">
        <v-app-bar-nav-icon @click.stop="mDrawer()"></v-app-bar-nav-icon>
      </a-tooltip>

      <v-spacer></v-spacer>
      <v-icon left>mdi-gitlab</v-icon>
      <v-toolbar-title>
        <a class="red--text">SYSTEM</a> MONITORING
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-navigation-drawer clipped app :mini-variant="CBlnDrawer" permanent>
      <v-list shaped dense nav>

        <template v-for="item in cObjItems">
          <template v-if="item.newTab">
            <v-list-item :key="item.title" @click="ExternalSystem(item.newTab)">
              <v-list-item-icon>
                <a-tooltip placement="right" :title="sBlnDrawer ? item.title : ''">
                  <v-icon color="black">{{ item.icon }}</v-icon>
                </a-tooltip>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>

          <template v-else>
            <v-list-item :key="item.title" @click="mChangeRouter(item.router)">
              <v-list-item-icon>
                <a-tooltip placement="right" :title="sBlnDrawer ? item.title : ''">
                  <v-icon color="black">{{ item.icon }}</v-icon>
                </a-tooltip>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </template>

        <!-- <v-list-item v-for="item in cObjItems" :key="item.title" @click="mChangeRouter(item.router)">
          <v-list-item-icon>
            <a-tooltip placement="right" :title="sBlnDrawer ? item.title : ''">
              <v-icon color="black">{{ item.icon }}</v-icon>
            </a-tooltip>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->

      </v-list>

      <template v-slot:append>
        <a-input-number v-if="blnAdministrator && (sObjUserInfo == 'nhel34983@gmail.com' || sObjUserInfo == 'janren38236@gmail.com') && $router.app._route.path == '/DailyCommits'" placeholder="Save Range" style="width: 100%" v-model="CIntGetCommits"></a-input-number>
        <v-divider></v-divider>

        <v-list dense nav>
          <v-list-item @click="mShowLogIn()" v-if="sObjUserInfo == ''">
            <v-list-item-icon>
              <a-tooltip placement="right" :title="sBlnDrawer ? 'Log In' : ''">
                <v-icon color="black" left>mdi-key</v-icon>
              </a-tooltip>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Log In</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="mLogOut()" v-else>
            <v-list-item-icon>
              <a-tooltip placement="right" :title="sBlnDrawer ? 'Log Out' : ''">
                <v-icon color="black" left>mdi-lock</v-icon>
              </a-tooltip>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Log Out</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <a-modal v-model="blnShowLogIn" :width="400">
      <span slot="title">
        <v-toolbar-title>
          <v-icon left>mdi-gitlab</v-icon>
          <a style="color: red">Gitlab</a> Monitoring
          <a style="color: blue">Log In</a>
        </v-toolbar-title>
      </span>

      <a-form layout="vertical">
        <a-form-item labelAlign="left" label="Gitlab Email :" required style="width: 100%">
          <a-input ref="strGitlabEmail" v-model="strGitlabEmail" @keypress.enter="mLogIn()">
            <a-select slot="addonAfter" v-model="strEmailSuffix" style="width: 150px">
              <a-select-option v-for="item in objEmailSuffix" :key="item" :value="item">{{ item }}</a-select-option>
            </a-select>
          </a-input>
        </a-form-item>
      </a-form>

      <template slot="footer">
        <a-button key="back" @click="blnShowLogIn = false">Cancel</a-button>
        <a-button icon="key" key="submit" type="primary" :disabled="strGitlabEmail == ''" @click="mLogIn()">
          Log In
        </a-button>
      </template>
    </a-modal>

    <a-modal v-model="blnServer" :footer="null" :maskClosable="false" :closable="false" :width="400">
      <a-result status="500" title="Can't connect to server." sub-title="Server under maintenance or shutdown.">
        <template #extra>
          <a-button type="primary" icon="reload" @click="mReload()">
            Refresh
          </a-button>
        </template>
      </a-result>
    </a-modal>
  </div>
</template>
<!-- ============================================================================================== -->
<!-- ========================================== Scripts =========================================== -->
<!-- ============================================================================================== -->
<script>
  import axios from "axios"
  export default {
// ************************************************************************************* //
// ===================================== Components ==================================== //
// ************************************************************************************* //
    components:{},
// ******************************************************************************* //
// ===================================== Data ==================================== //
// ******************************************************************************* //
    data(){
      return{
        blnServer: false,
        blnShowLogIn: false,
        blnshowdate: true,

        strGitlabEmail: "",
        strEmailSuffix: "",
        
        date: [],
        objEmailSuffix: [],
      }
    },
// ********************************************************************************** //
// ===================================== Created ==================================== //
// ********************************************************************************** //
    created(){
      this.mCheckServer()
      this.mGetData()
      this.smGetGitlabAdministrators()
      this.smGetNotificationData()
      this.smGetNotification()
    },
// *********************************************************************************** //
// ===================================== Computed ==================================== //
// *********************************************************************************** //
    computed:{
      CIntGetCommits:{
        get(){
          return this.sIntGetCommits
        },
        set(value){
          this.$store.commit("CHANGE_sIntGetCommits", value)
        },
      },
      CIntDays:{
        get(){
          return this.sIntDays
        },
        set(value) {
          this.$store.commit("CHANGE_sIntDays", value);
        },
      },
      CIntListRouter:{
        get(){
          return this.sIntListRouter
        },
        set(value){
          this.$store.commit("CHANGE_sIntListRouter", value)
        },
      },
      CBlnDrawer:{
        get(){
          return this.sBlnDrawer
        },
        set(value){
          this.$store.commit("CHANGE_sBlnDrawer", value)
        },
      },
      cObjItems(){
        let data = [
          {
            title: "Projects List",
            icon: "mdi-file-cabinet",
            router: "/Project",
            show: true,
          },
          {
            title: "Projects Monitoring",
            icon: "mdi-vuejs",
            newTab: "http://hrdapps68/ProjectMonitoring/",
            show: true,
          },
          {
            title: "Daily Commits",
            icon: "mdi-calendar-check-outline",
            router: "/DailyCommits",
            show: true,
          },
          {
            title: "Programmers' Projects List",
            icon: "mdi-card-account-details-outline",
            router: "/Programmers",
            show: true,
          },
          {
            title: "Member List",
            icon: "mdi-account-details",
            router: "/Member",
            show: this.blnAdministrator,
          },
        ]
        data = data.filter((rec) => {
          return rec.show == true
        })
        return data
      },
    },
// ********************************************************************************** //
// ===================================== Methods ==================================== //
// ********************************************************************************** //
    methods:{
      mReload(){
        location.reload()
      },
      mDrawer(){
        this.$store.commit("CHANGE_sBlnDrawer", !this.sBlnDrawer)
        this.$store.commit("CHANGE_sIntDays", this.sBlnDrawer ? 14 : 12)
      },
      mCheckServer(){
        let url = `${this.$store.state.gitlab_api}/api/v4/projects?private_token=mxus9a5iYWGjkw_TqTsD&active=true&page1&per_page=100`
        axios.get(url).then(res => {
          if(res.data.length != 0){
            this.blnServer = false
          }
        })
        .catch(err => {
          this.blnServer = true
          console.log(err)
          console.log(url)
        })
      },
      mGetData(){
        let url = `${this.api}/Gitlab_User`
        axios.get(url).then(res => {
          let objData = res.data
          this.objEmailSuffix = [
            ...new Set(
              objData.map(rec => {
                let Suffix = rec.Email.split("@")
                return "@" + Suffix[1]
              })
            ),
          ]
          if(this.objEmailSuffix.length != 0){
            this.strEmailSuffix = this.objEmailSuffix[0]
          }
        })
      },
      mShowLogIn(){
        this.blnShowLogIn = true
        this.strGitlabEmail = ""
      },
      mChangeRouter(data){
        if(this.$router.app._route.path != data){
          this.$router.push(data)
        }
      },
      mLogOut(){
        let self = this
        this.$confirm({title: "Do you want to logout ?",
                      cancelText: "No",
                      okText: "Yes",
                      content: (<div style="color:blue">
                                  Gitlab Email
                                  <i> - {this.sObjUserInfo} </i>
                                </div>),
        onOk(){
            self.$store.commit("CHANGE_sObjUserInfo", "")
            self.$notification.success({ message: "Gitlab Monitoring", description: "Logout Successfull" })
            self.$store.commit("CHANGE_sIntListRouter", 0)
            if(self.$router.app._route.path == "/Member"){
              self.mChangeRouter("/")
            }
        },
        onCancel(){},
        })
      },
      mLogIn(){
        let url = `${this.api}/Gitlab_UserEmail`
        let data = { Email: this.strGitlabEmail + this.strEmailSuffix }
        axios.get(url, { params: data }).then(res => {
          let objData = []
          objData = res.data
          if(objData.length != 0 && objData.length != undefined){
            this.$store.commit("CHANGE_sObjUserInfo", this.strGitlabEmail + this.strEmailSuffix)
            this.$notification.success({ message: "Gitlab Monitoring", description: "Login Successfull." })
            this.blnShowLogIn = false
          }
          else{
            this.$notification.error({ message: "Gitlab Monitoring", description: "Gitlab email not valid." })
          }
        })
        .catch(err => {
          console.log(err)
          console.log(url)
          this.$notification.error({ message: "Gitlab Monitoring", description: "Gitlab email not valid." })
        })
      },
      ExternalSystem(Link){
        window.open(Link, "_blank")
      }
    },
  }
</script>
<!-- ============================================================================================== -->
<!-- =========================================== Styles =========================================== -->
<!-- ============================================================================================== -->
<style>
  #mynav{
    border-radius: 5px;
  }
</style>