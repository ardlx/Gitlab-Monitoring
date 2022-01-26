<template>
  <div>
    <v-fab-transition origin="top left">
      <v-card class="mx-2" id="MyCard" tile v-if="blnMounted">
<!-- ******************************************************************************************** -->
<!-- ========================================== Header ========================================== -->
<!-- ******************************************************************************************** -->
        <v-card-title>
          <v-icon left>mdi-calendar-check-outline</v-icon>Daily Commit
          <v-row no-gutters justify="space-around">
            <v-col cols="2">
              <a-select showSearch :filter-option="filterOption" allowClear v-model="strFilterSections" placeholder="Section" @change="(intPageNo = 1), (strFilterTeams = undefined)" style="width: 100%">
                <a-select-option v-for="item in objSections" :key="item.SectionID" :value="item.SectionID">
                  {{ item.SectionName }}
                </a-select-option>
              </a-select>
            </v-col>

            <v-col cols="2">
              <a-select showSearch :filter-option="filterOption" allowClear v-model="strFilterTeams" placeholder="Team" @change="intPageNo = 1" style="width: 100%">
                <a-select-option v-for="item in filteredTeam" :key="item.TeamID" :value="item.TeamID">
                  {{ item.TeamName }}
                </a-select-option>
              </a-select>
            </v-col>

            <v-col :cols="blnAdministrator ? 6 : 7">
              <a-input-search allowClear v-model="strSearch" placeholder="Search Members" @input="intPageNo = 1"/>
            </v-col>

            <v-col cols="1" v-if="blnAdministrator">
              <a-tooltip placement="bottom" title="Save Commit">
                <a-button @click="mSaveCommit()" type="primary" icon="save" v-if="blnAdministrator">
                  Save
                </a-button>
              </a-tooltip>
            </v-col>
          </v-row>
        </v-card-title>
<!-- ============================================================================================ -->
<!-- ======================================== Date Range ======================================== -->
<!-- ============================================================================================ -->
        <v-divider></v-divider>
        <v-card-title>
          <v-spacer></v-spacer>
          <a-tooltip placement="top">
            <span slot="title">Previous {{ sIntDays }} days</span>
            <v-btn icon outlined color="primary" dense @click="mPrev(sIntDays, 'days')">
              <a-icon class="mr-1" type="double-left" />
            </v-btn>
          </a-tooltip>

          <a-tooltip placement="top">
            <span slot="title">Previous day</span>
            <v-btn class="mx-1" icon outlined color="primary" dense @click="mPrev(1, 'days')">
              <a-icon class="mr-1" type="left" />
            </v-btn>
          </a-tooltip>

          <v-spacer></v-spacer>
          <span style="color:black;">
            {{ moment(CalendarDate).subtract(sIntDays - 1, "days").format("LL") }} - {{ moment(CalendarDate).format("LL") }}
          </span>
          <v-spacer></v-spacer>

          <a-tooltip placement="top">
            <span slot="title">Next day</span>
            <v-btn class="mx-1" icon outlined color="primary" dense @click="mNext(1, 'days')">
              <a-icon class="ml-1" type="right" />
            </v-btn>
          </a-tooltip>

          <a-tooltip placement="top">
            <span slot="title">Next {{ sIntDays }} days</span>
            <v-btn icon outlined color="primary" dense @click="mNext(sIntDays, 'days')">
              <a-icon class="ml-1" type="double-right" />
            </v-btn>
          </a-tooltip>
          <v-spacer></v-spacer>
        </v-card-title>
<!-- ============================================================================================ -->
<!-- ====================================== Daily Commits ======================================= -->
<!-- ============================================================================================ -->
        <v-card-text class="py-0">
          <div id="MyTable">
            <v-simple-table dense fixed-header>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-center" id="MyBorder" style="color:black;">SECTION</th>
                    <th class="text-center" id="MyBorder" style="color:black;">TEAM</th>
                    <th class="text-center" id="MyBorder" style="color:black;">MEMBERS</th>
                    <th v-for="i in cObjHeader" :key="i.day" class="text-center" id="MyBorder" :style="`${mGetDayColor(i.day)}`">
                      <a-tooltip placement="top" :title="moment(i.day).format('MMMM YYYY')">
                        {{ moment(i.day).format("ddd DD") }}
                      </a-tooltip>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="item in cPaginatedData" :key="item.name">
                    <td class="text-center" id="MyBorder">
                      {{ mGetSectionName(item.SectionID) }}
                    </td>

                    <td class="text-center" id="MyBorder">
                      {{ mGetTeamName(item) }}
                    </td>

                    <td class="text-left" id="MyBorder">
                      <v-list-item class="pa-0">
                        <v-list-item-avatar tile>
                          <a-avatar shape="square" :src="item.Avatar">{{
                            item.Name.substring(0, 1).toUpperCase()
                          }}</a-avatar>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <a-tooltip placement="right" title="Double click to open member activity">
                            <a @dblclick=" mOpenURL( `${$store.state.gitlab_api}/${item.UserName}` ) " style="text-decoration: underline">
                              {{ item.Name }}
                            </a>
                          </a-tooltip>
                        </v-list-item-content>
                      </v-list-item>
                    </td>
                    
                    <td class="text-center" id="MyBorder" v-for="i in cObjHeader" :key="i.day" :style="`${mGetDayColorCell(item.Email, item.ID, i.day)}`">
                      <div v-if=" moment(ToDay).format('YYYYMMDD') >= moment(i.day).format('YYYYMMDD') ">
                        <div v-if="mCheckCommits(item.Email, item.ID, i.day)">
                          <a-icon v-if=" moment(ToDay).format('YYYYMMDD') > moment(i.day).format('YYYYMMDD') " type="check-circle" theme="twoTone" :two-tone-color="`${moment(ToDay).subtract( moment(ToDay).subtract(1, 'days').format('dddd') == 'Sunday' ? 2 : 1, 'days' ).format('YYYYMMDD') == moment(i.day).format('YYYYMMDD') ? '#8bb1e6' : 'green' }`" :style="`font-size:${moment(ToDay).subtract( moment(ToDay).subtract(1, 'days').format('dddd') == 'Sunday' ? 2 : 1, 'days' ).format('YYYYMMDD') == moment(i.day).format('YYYYMMDD') ? '25' : '20' }px`"/>
                          <a-icon v-else type="check-circle" theme="twoTone" two-tone-color="orange" style="font-size:25px"/>
                        </div>
                        <div v-else-if="mCheckAbsent(item.ID, i.day)">
                          <a-icon type="close-circle" theme="twoTone" two-tone-color="red" style="font-size:25px;"/>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <a-empty v-if="cPaginatedData.length == 0" class="mt-10"></a-empty>
          </div>
<!-- ============================================================================================ -->
<!-- ======================================== Pagination ======================================== -->
<!-- ============================================================================================ -->
          <div class="mt-2">
            <v-row no-gutters justify="space-around">
              <v-col cols="auto">
                <v-pagination dense v-model="intPageNo" :length="cPageCount" :total-visible="5" dark prev-icon="mdi-menu-left" next-icon="mdi-menu-right"></v-pagination>
              </v-col>
<!-- ============================================================================================ -->
<!-- ======================================== Legends =========================================== -->
<!-- ============================================================================================ -->
              <v-col cols="auto">
                <v-row id="MyBorder" class="pa-0 ma-0" justify="center">
                  <v-col cols="auto" style="color:black;">
                    <v-layout>
                      <a-avatar class="mr-1" shape="square" size="small" :style="{ backgroundColor: '#eb7f7f', verticalAlign: 'middle', }"></a-avatar>
                      - No Commit
                    </v-layout>
                  </v-col>

                  <v-col cols="auto" style="color:black;">
                    <v-layout>
                      <a-avatar class="mr-1" shape="square" size="small" :style="{ backgroundColor: '#5cd8ea', verticalAlign: 'middle', }"></a-avatar>
                      - Holiday
                    </v-layout>
                  </v-col>

                  <v-col cols="auto" style="color:black;">
                    <v-layout>
                      <a-icon class="mr-1" type="close-circle" theme="twoTone" two-tone-color="red" style="font-size:20px;"/>
                      - Absent
                    </v-layout>
                  </v-col>

                  <v-col cols="auto" style="color:black;">
                    <v-layout>
                      <a-icon class="mr-1" type="check-circle" theme="twoTone" two-tone-color="green" style="font-size:20px;"/>
                      - Commited
                    </v-layout>
                  </v-col>

                  <v-col cols="auto" style="color:black;">
                    <v-layout>
                      <a-icon class="mr-1" type="check-circle" theme="twoTone" two-tone-color="#8bb1e6" style="font-size:20px"/>
                      - Yesterday's Commit
                    </v-layout>
                  </v-col>

                  <v-col cols="auto" style="color:black;">
                    <v-layout>
                      <a-icon class="mr-1" type="check-circle" theme="twoTone" two-tone-color="orange" style="font-size:20px"/>
                      - Today's Commit
                    </v-layout>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>
    </v-fab-transition>
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
        blnLoading: false,

        ToDay: "",
        CalendarDate: "",
        strSearch: "",
        strFilterSections: undefined,
        strFilterTeams: undefined,
        strNoDataImage: Empty.PRESENTED_IMAGE_SIMPLE,

        intPageNo: 1,
        intRowNo: 10,
        
        objSections: [],
        objTeams: [],
        objProjects: [],
        objCommits: [],
        objUsers: [],
        objData: [],
        objExportToExcel: [],
        objCommitsAll: [],
        objHolidays: [],
        objAbsents: [],
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
    created() {
      this.$notification.config({
        placement: "bottomRight",
        duration: 3,
      })
      this.ToDay = new Date()
      this.CalendarDate = new Date()
      this.mSaveAbsentsToday()
      this.mGetHolidays()
      this.mGetUsers()
      this.mGetData()
      this.mGetProjects()
      this.mGetSections()
      this.mGetTeams()
    },
// *********************************************************************************** //
// ===================================== Computed ==================================== //
// *********************************************************************************** //
    computed:{
      filteredSearch(){
        let data = this.objUsers.filter(rec => {
          return(rec.Name.toUpperCase().includes(this.strSearch.toUpperCase()) && rec.BlnInclude == true)
        })
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
      filteredTeam(){
        let data = this.objTeams
        if(this.strFilterSections != undefined){
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
        const daystart = moment(this.CalendarDate).subtract( this.sIntDays - 1, "days" )
        for(let a = 0; a < this.sIntDays; a++){
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
      },
    },
// ******************************************************************************* //
// =================================== Methods =================================== //
// ******************************************************************************* //
    methods:{
      moment,
      filterOption(input,option){
        return(option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
      },
      mOpenURL(href){
        window.open(href, "_blank")
      },
      mSaveAbsentsToday(){
        let url = `${this.api}/SaveAbsentsToday`
        axios.post(url).then(res => {
          console.log(res.data)
          this.mGetAbsents()
        })
      },
      mGetAbsents(){
        let url = `${this.api}/GetAbsents`
        axios.get(url).then(res => {
          let Absents = res.data
          Absents.forEach(Data => {
            this.objAbsents.push(moment(Data.AbsentDate).format("YYYYMMDD") + '_' + Data.GitLab_ID)
          })
        })
      },
      mGetHolidays(){
        let url = 'http://10.168.64.223:4900/sharedApi/getHoliday'
        axios.get(url).then(Holidays => {
          let tempHolidays = Holidays.data
          tempHolidays.forEach(Data => {
            this.objHolidays.push(moment(Data).format("YYYYMMDD"))
          })
        })
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
        this.CalendarDate = moment(this.CalendarDate).add(day, type)
      },
      mPrev(day,type){
        this.CalendarDate = moment(this.CalendarDate).subtract(day, type)
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
        else if(this.objHolidays.includes(DDformat)){
          return "background-color:#5cd8ea;color:black;"
        }
        else{
          return "color:black;"
        }
      },
      mGetDayColorCell(email,ID,day){
        let theDate = moment(day).format("dddd")
        let DDformat = moment(day).format("YYYYMMDD")
        let ToDate = moment(this.ToDay).format("YYYYMMDD")

        if(this.mCheckCommits(email, ID, day) == false && this.mCheckAbsent(ID, day) == false){
          if(theDate == "Sunday"){
            return "background-color:grey"
          }
          else if(this.objHolidays.includes(DDformat)){
            return "background-color:#5cd8ea"
          }
          else if(DDformat < ToDate){
            return "background-color:#eb7f7f"
          }
          else{
            return ""
          }
        }
        else {
          return ""
        }
      },
      mCheckCommits(email,ID,day){
        let toReturn = false
        const theDate = moment(day).format("MMDDYYYY")
        const MM = moment(day).format("MM")
        const YYYY = moment(day).format("YYYY")
        const SaveCommits = this.objData.find(rec => {
          return(rec.Gitlab_ID == ID && rec.Gitlab_MM == MM && rec.Gitlab_YYYY == YYYY)
        })
        const objCommitDay = this.objCommits.filter(rec => {
          return(rec.Email == email && moment(rec.Date).format("MMDDYYYY") == theDate)
        })
        if(SaveCommits != undefined){
          toReturn = SaveCommits[`Bln_${Number(moment(day).format("DD"))}`]
        }
        if(toReturn == false || toReturn == null){
          toReturn = objCommitDay.length != 0
        }
        return toReturn
      },
      mCheckAbsent(ID,day){
        let toReturn = false
        let DDformat = moment(day).format("YYYYMMDD")

        if(this.objAbsents.includes(DDformat + '_' + ID)){
          toReturn = true
        }

        return toReturn
      },
      mGetProjects(){
        this.blnLoading = true
        this.objProjects = []
        this.objCommits = []
        this.objCommitsAll = []
        const me = this
        async function getall(){
          for(let a = 1; a < 100; a++){
            let url = `${me.$store.state.gitlab_api}/api/v4/projects?private_token=mxus9a5iYWGjkw_TqTsD&active=true&page=${a}&per_page=100`
            await axios.get(url).then(res => {
              me.mGetAllProjects(res.data)
              me.mGetCommits(res.data)
              if(res.data.length < 100){
                a = 100
              }
            })
            .catch(err => {
              console.log(err)
              console.log(url)
            })
          }
          me.blnLoading = false
        }
        getall()
      },
      mGetUsers(){
        let url = `${this.api}/Gitlab_User`
        axios.get(url).then(res => {
          this.objUsers = res.data
        })
        .catch(err => {
          console.log(err)
          console.log(url)
        })
      },
      mGetData(){
        let url = `${this.api}/Gitlab_Data`
        axios.get(url).then(res => {
          this.objData = res.data
        })
        .catch(err => {
          console.log(err)
          console.log(url)
        })
      },
      mGetSections(){
        let url = `${this.api}/Sections`
        axios.get(url).then(res => {
          this.objSections = res.data.filter(SectionDetails => {
            return(SectionDetails.SectionID !== 5)
          })
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
      mGetCommits(value){
        const daystart = moment(this.ToDay).subtract(this.sIntGetCommits, "days").format("YYYY-MM-DD") + "T00:00:00Z"
        const dayend = moment(this.ToDay).add(1, "days").format("YYYY-MM-DD") + "T00:00:00Z"
        const me = this
        async function getall(){
          for(let b = 0; b < value.length; b++){
            const projectID = value[b].id
            const projectName = value[b].name
            let url = `${me.$store.state.gitlab_api}/api/v4/projects/${projectID}/repository/commits?private_token=mxus9a5iYWGjkw_TqTsD&since=${daystart}&until=${dayend}&page=1&per_page=100&all=true`
            await axios.get(url).then(res => {
              let data = res.data.map(rec => {
                let myData = { id: projectID, ProjectName: projectName, Name: rec.committer_name, Email: rec.committer_email, Date: rec.committed_date }
                return myData
              })
              me.mGetAllCommits(data)
            })
            .catch(err => {
              console.log(err)
              console.log(url)
            })
          }
        }
        getall()
      },
      mGetAllProjects(data){
        this.objProjects = this.objProjects.concat(data)
      },
      mGetAllCommits(data){
        this.objCommits = this.objCommits.concat(data)
      },
      mSaveCommit(){
        const mapCommits = this.objCommits.map(rec => {
          let member = this.objUsers.find(a => {
            return a.Email == rec.Email
          })
          if(member == undefined){
            member = { ID: 0 }
          }
          let myData = { id: rec.id, ProjectName: rec.ProjectName, Name: rec.Name, Email: rec.Email, Gitlab_ID: member.ID, Date: rec.Date, Column: `bln_${Number(moment(rec.Date).format("DD"))}` }
          return myData
        })
        let toloopdata = mapCommits.filter(rec => {
          return rec.Gitlab_ID != 0
        })
        for(let b = 0; b < toloopdata.length; b++){
          let com = toloopdata[b]
          let MM = Number(moment(com.Date).format("MM"))
          let YYYY = Number(moment(com.Date).format("YYYY"))
          let data = { Gitlab_ID: com.Gitlab_ID, Column: com.Column, Gitlab_MM: MM, Gitlab_YYYY: YYYY }
          let url = `${this.api}/Gitlab_DataUpdate`
          axios.post(url,data).then(res => {
            let ret = res.data
            if(ret.Gitlab_ID != data.Gitlab_ID){
              console.log(res.data)
              // console.log(data)
            }
          })
        }
        const daystart = moment(this.ToDay).subtract(this.sIntGetCommits, "days").format("YYYY-MM-DD")
        const dayend = moment(this.ToDay).format("YYYY-MM-DD")
        this.$notification.success({ message: "Gitlab Monitoring", description: `Successfully save commits from  ${daystart} to ${dayend}` })
        this.mGetData()
      },
      mExportToExcel(data){
        this.objExportToExcel = []
        let lastdate = data
        let mapData = lastdate.map(rec => {
          let names = this.objUsers.find(recs => {
            return recs.Email == rec.Email
          })
          if(names != undefined){
            return{
              Section: this.mGetSectionName(names.SectionID) != null ? this.mGetSectionName(names.SectionID) : "",
              Team: this.mGetTeamName(names) != null ? this.mGetTeamName(names) : "",
              ProjectID: rec.id,
              ProjectName: rec.ProjectName,
              MemberName: names.Name
            }
          }
          else{
            return {
              Section: "",
              Team: "",
              ProjectID: rec.id,
              ProjectName: rec.ProjectName,
              MemberName: rec.Email,
            }
          }
        })
        for(let a = 0; a < mapData.length; a++){
          const data = mapData[a]
          let findData = this.objExportToExcel.find(rec => {
            return(rec.ProjectID == data.ProjectID && rec.MemberName == data.MemberName)
          })
          if(findData == undefined){
            this.objExportToExcel.push(data)
          }
        }
      },
    },
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