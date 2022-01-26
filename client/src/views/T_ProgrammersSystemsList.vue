<template>
  <div>
<!-- ************************************************************************************************* -->
<!-- ========================================= 404 Not Found ========================================= -->
<!-- ************************************************************************************************* -->
    <a-result v-if="blnURLNotFound" status="404" title="404" sub-title="Sorry, the page you visited does not exist."></a-result>
<!-- ************************************************************************************************* -->
<!-- ============================================= Header ============================================ -->
<!-- ************************************************************************************************* -->
    <v-row v-else no-gutters>
      <v-col cols="12">
        <span>
          <v-card class="mx-2 mb-1" tile> 
            <v-card-title>
              <v-row no-gutters justify="space-around">

                <v-icon left> mdi-card-account-details-outline </v-icon> Programmers' Project List

                <v-col cols="2" class="pt-1">
                  <a-select showSearch :filter-option="FilterOption" allowClear v-model="strFilterSections" placeholder="Section" @change="(intPageNo = 1), GetSectionTeams(), strFilterTeams = undefined" style="width: 100%">
                    <a-select-option v-for="item in objSections" :key="item.SectionID" :value="item.SectionID" >{{ item.SectionName }}</a-select-option>
                  </a-select>
                </v-col>

                <v-col cols="2" class="pt-1">
                  <a-select showSearch :filter-option="FilterOption" allowClear v-model="strFilterTeams" placeholder="Team" @change="(intPageNo = 1)" style="width: 100%">
                    <a-select-option v-for="item in objFilteredTeams" :key="item.TeamID" :value="item.TeamID" >{{ item.TeamName }}</a-select-option>
                  </a-select>
                </v-col>

                <v-col cols="2" class="pt-1">
                  <a-input-search allowClear v-model="strFilterProgrammer" placeholder="Programmer" @input="(intPageNo = 1)" style="width:100%;"></a-input-search>
                </v-col>

                <v-col cols="2" class="pt-1">
                  <a-button @click="OpenExportTaskMonitoringForm()" type="primary" icon="project">Task Monitoring</a-button>
                </v-col>

              </v-row>
            </v-card-title>
          </v-card>
        </span>
      </v-col>
<!-- ************************************************************************************************* -->
<!-- ======================================== Programmer List ======================================== -->
<!-- ************************************************************************************************* -->
      <v-col cols="5">
        <v-scroll-y-transition>
          <v-card v-if="blnMounted" :disabled="blnLoading" class="MyCard1" style="margin:0px 0px 0px 8px;" tile>
            <v-card-title class="pt-3 pb-3">
              <v-icon left>mdi-badge-account-outline</v-icon>Programmer List
            </v-card-title>
            <hr><br>
<!-- ==================================================================== -->
<!-- =============================== List =============================== -->
<!-- ==================================================================== -->
            <v-card-text class="py-0">
              <a-list class="MyDiv1" :data-source="compPagedData" :loading="blnLoading" size="small" item-layout="horizontal" bordered>
                <a-list-item :id="item.Name" slot="renderItem" slot-scope="item" :style="`background-color:${Programmer === item.Name ? '#90CAF9' : item.Name === null ? '#7CB342' : ''}`">
                  <a-list-item-meta @click="ClickProgrammer(item.ID, item.Name, item.Avatar)">
                    <a-avatar class="mt-1" :src="item.Avatar" slot="avatar" :size="45" shape="square">
                      {{item.Name.substring(0, 1).toUpperCase()}}
                    </a-avatar> 
                    
                    <span slot="title" :style="`font-size:17px;`" :class="Programmer === item.Name ? 'black--text' : ''">
                      {{item.Name}}
                    </span>

                    <span slot="description">
                      Section:
                      <span class="black--text pr-15">
                        {{GetSectionName(item.SectionID)}}
                      </span>
                      Team:
                      <span class="black--text">
                        {{GetTeamName(item.SectionID, item.TeamID)}}
                      </span>
                    </span>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
<!-- ==================================================================== -->
<!-- ============================ Pagination ============================ -->
<!-- ==================================================================== -->
              <div>
                <v-row class="mt-3" no-gutters justify="center">
                  <v-col align="center">
                    <a-select :filter-option="FilterOption" @change="(intPageNo = 1)" v-model="intRowNo" placeholder="Row No" style="width: 60%">
                      <a-select-option v-for="item in objPagination" :key="item.No" :value="item.No" >
                        <div v-if="item.No != 0">
                          {{ item.No }} rows per page
                        </div>
                        <div v-else>All</div>
                      </a-select-option>
                    </a-select>
                  </v-col>

                  <v-col>
                    <v-btn :disabled="intPageNo <= 1" @click="(intPageNo = intPageNo - 1)" icon tile>
                      <v-icon>mdi-menu-left</v-icon>
                    </v-btn>
                    {{intPageNo + ` of ` + compPageCount}}
                    <v-btn :disabled="intPageNo >= compPageCount" @click="(intPageNo = intPageNo + 1)" icon tile>
                      <v-icon>mdi-menu-right</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-scroll-y-transition>
      </v-col>
<!-- ********************************************************************************************** -->
<!-- ======================================== Project List ======================================== -->
<!-- ********************************************************************************************** -->
      <v-col cols="7">
        <v-scroll-y-reverse-transition>
          <v-card v-if="blnMounted" class="MyCard1 mx-2" tile>
            <v-card-title :class="ProgrammerAvatar.length !== 0 ? 'pt-2 pb-2' : 'pt-3 pb-3'">
              <v-icon left>mdi-file-cabinet</v-icon>Project List
              <v-spacer></v-spacer>

              <div>
                <span>
                  <a-tooltip :title="`Double click here to open Programmer's GitLab Profile`" placement="right">
                    <a :style="`font-size:18px;text-decoration:underline;`" @dblclick="OpenProgrammerProfile()">{{Programmer}}</a>
                  </a-tooltip>
                </span>
                
                <span class="pl-4 pr-5">
                  <a-tooltip :title="`Double click here to open Programmer's GitLab Profile`" placement="top">
                    <a-avatar v-if="ProgrammerAvatar.length !== 0" :src="ProgrammerAvatar" @dblclick="OpenProgrammerProfile()" size="large" shape="circle" class="MyAvatar1">
                      {{Programmer.substring(0, 1).toUpperCase()}}
                    </a-avatar>
                  </a-tooltip>
                </span>
              </div>

            </v-card-title>
            <hr>
<!-- ==================================================================== -->
<!-- =========================== Initial Form =========================== -->
<!-- ==================================================================== -->
            <a-result v-if="objProgrammerProjects.length === 0 && blnLoading === false" title="Welcome to Programmer's Project List." >
              <template #subTitle>
                <v-icon large class="pb-1" color="blue">mdi-hand-pointing-left</v-icon>
                <strong>{{` Click item from the List to view Programmer's Projects.`}}</strong>
              </template>
              <template #icon>
                <a-icon type="gitlab"></a-icon>
              </template>
            </a-result>
<!-- ==================================================================== -->
<!-- =========================== Loading Form =========================== -->
<!-- ==================================================================== -->
            <a-result v-else-if="blnLoading === true" title="Gathering Data..." >
              <template #subTitle>
                <v-icon large class="pb-1" color="blue">mdi-hand</v-icon>
                <strong>{{`Please wait...`}}</strong>
              </template>
              <template #icon>
                <a-icon type="gitlab" />
              </template>
            </a-result>
            <template v-else>
<!-- ============================================================================ -->
<!-- ========================= OnGoing New Systems List ========================= -->
<!-- ============================================================================ -->
              <a-tooltip placement="right" :title=" blnNewSystems === true ? `Hide`: `Show`">
                <div class="MyDiv3" @click="ShowNewSystems()">
                  <v-card-title class="pt-0 pb-0" :style="`font-size:16px;font-weight:bold;`">
                    <v-icon v-if="blnNewSystems === true" left color="white" large>mdi-chevron-down</v-icon>
                    <v-icon v-else-if="blnNewSystems === false" left color="white" large>mdi-chevron-left</v-icon>
                    <!-- <v-icon class="pl-3" left color="red">mdi-new-box</v-icon> New and Remake Systems - OnGoing ({{intNewSystems}}) -->
                    <v-icon class="pl-3" left color="pink">mdi-rhombus-split</v-icon> New, Remake, MagicV8, and iCAD Systems - OnGoing ({{intNewSystems}})
                  </v-card-title>
                </div>
              </a-tooltip>

              <div v-if="blnNewSystems === true">
                <v-card-text>
                  <a-list class="MyDiv2" size="small" item-layout="horizontal" :style="intNewSystems !== 0 ? `max-height: calc(100vh - 514px); min-height: calc(100vh - 514px)` : `max-height: calc(100vh - 692px); min-height: calc(100vh - 692px)`" :data-source="OnGoingNewSystems()" bordered>
                    <a-list-item class="pl-3 pt-3 pb-3" slot="renderItem" slot-scope="item">

                      <a-list-item-meta>
                        <a-avatar class="mt-1" :src="item.Avatar" slot="avatar" size="large" shape="square">
                          {{item.ProjectName.substring(0, 1).toUpperCase()}}
                        </a-avatar> 

                        <span slot="title">
                          <v-icon v-if="item.Type === 1" left color="red">mdi-new-box</v-icon>  
                          <v-icon v-else-if="item.Type === 2" left color="green">mdi-registered-trademark</v-icon>
                          <v-icon v-else-if="item.Type === 5" left color="orange">mdi-alpha-m-box-outline</v-icon>
                          <v-icon v-else-if="item.Type === 6" left color="purple">mdi-alpha-i-circle-outline</v-icon>
                          <a-tooltip placement="right" :title="`Double click here to open Project's GitLab Page`">
                            <a :style="`font-size:17px;text-decoration: underline;`" @dblclick="OpenProjectPage(item.ProjectID, item.ProjectName, `Page`)">{{item.ProjectName}}</a>
                          </a-tooltip>
                        </span>
                      </a-list-item-meta>

                      <div class="pr-8">
                        <a-tooltip placement="right" :title="`Double click here to open Project's GitLab Issues Page`">
                          <a :style="`font-size:13px;text-decoration: underline;`" @dblclick="OpenProjectPage(item.ProjectID, item.ProjectName, `Issues`)">
                            <span class="ma-0 text-right">
                              <v-progress-linear rounded slot="extra" height="25" style="width: 100px;" :value="item.ProjectPercentage">
                                <template v-slot="{value}">{{value}}%</template>
                              </v-progress-linear>
                            </span>
                          </a>
                        </a-tooltip>
                      </div>

                      <div class="pr-5">
                        <v-icon small class="pr-1">mdi-file-cabinet</v-icon>
                        <a-tooltip placement="right" :title="`Double click here to open Project's Project List Page`">
                          <a :style="`font-size:13px;text-decoration: underline;`" @dblclick="OpenProjectPage(item.ProjectID, item.ProjectName, `Project List`)">Project List</a>
                        </a-tooltip>

                        <v-spacer></v-spacer>

                        <v-icon small class="pr-1">mdi-newspaper</v-icon>
                        <a-tooltip placement="right" :title="`Double click here to open Project's GitLab Wiki Page`">
                          <a :style="`font-size:13px;text-decoration: underline;`" @dblclick="OpenProjectPage(item.ProjectID, item.ProjectName, `Wiki`)">Wiki</a>
                        </a-tooltip>
                      </div>

                    </a-list-item>
                  </a-list>
                </v-card-text>
              </div>

              <div v-if="blnNewSystems === false" class="pb-1"></div>
<!-- =============================================================================== -->
<!-- ========================= OnGoing Maintenance Systems ========================= -->
<!-- =============================================================================== -->
              <a-tooltip placement="right" :title=" blnMaintenanceSystems === true ? `Hide`: `Show`">
                <div class="MyDiv3" @click="ShowMaintenanceSystems()">
                  <v-card-title class="pt-0 pb-0" :style="`font-size:16px;font-weight:bold;`">
                    <v-icon v-if="blnMaintenanceSystems === true" left color="white" large>mdi-chevron-down</v-icon>
                    <v-icon v-else-if="blnMaintenanceSystems === false" left color="white" large>mdi-chevron-left</v-icon>
                    <v-icon class="pl-3" left color="black">mdi-tools</v-icon>Maintenance Systems - OnGoing ({{intMaintenanceSystems}})
                  </v-card-title>
                </div>
              </a-tooltip>

              <div v-if="blnMaintenanceSystems === true">
                <v-card-text>
                  <a-list class="MyDiv2" size="small" item-layout="horizontal" :style="intMaintenanceSystems !== 0 ? `max-height: calc(100vh - 514px); min-height: calc(100vh - 514px)` : `max-height: calc(100vh - 692px); min-height: calc(100vh - 692px)`" :data-source="OnGoingMaintenanceSystems()" bordered>
                    <a-list-item class="pl-3 pt-3 pb-3" slot="renderItem" slot-scope="item">

                      <a-list-item-meta>
                        <a-avatar class="mt-1" :src="item.Avatar" slot="avatar" size="large" shape="square">
                          {{item.ProjectName.substring(0, 1).toUpperCase()}}
                        </a-avatar> 

                        <span slot="title">
                          <v-icon left color="black">mdi-tools</v-icon>
                          <a-tooltip placement="right" :title="`Double click here to open Project's GitLab Page`">
                            <a :style="`font-size:17px;text-decoration: underline;`" @dblclick="OpenProjectPage(item.ProjectID, item.ProjectName, `Page`)">{{item.ProjectName}}</a>
                          </a-tooltip>
                        </span>
                      </a-list-item-meta>

                      <div class="pr-8">
                        <a-tooltip placement="right" :title="`Double click here to open Project's GitLab Issues Page`">
                          <a :style="`font-size:13px;text-decoration: underline;`" @dblclick="OpenProjectPage(item.ProjectID, item.ProjectName, `Issues`)">
                            <span class="ma-0 text-right">
                              <v-progress-linear rounded slot="extra" height="25" style="width: 100px" :value="item.ProjectPercentage">
                                <template v-slot="{value}">{{value}}%</template>
                              </v-progress-linear>
                            </span>
                          </a>
                        </a-tooltip>
                      </div>

                      <div class="pr-5">
                        <v-icon small class="pr-1">mdi-file-cabinet</v-icon>
                        <a-tooltip placement="right" :title="`Double click here to open Project's Project List Page`">
                          <a :style="`font-size:13px;text-decoration: underline;`" @dblclick="OpenProjectPage(item.ProjectID, item.ProjectName, `Project List`)">Project List</a>
                        </a-tooltip>

                        <v-spacer></v-spacer>

                        <v-icon small class="pr-1">mdi-newspaper</v-icon>
                        <a-tooltip placement="right" :title="`Double click here to open Project's GitLab Wiki Page`">
                          <a :style="`font-size:13px;text-decoration: underline;`" @dblclick="OpenProjectPage(item.ProjectID, item.ProjectName, `Wiki`)">Wiki</a>
                        </a-tooltip>
                      </div>

                    </a-list-item>
                  </a-list>
                </v-card-text>
              </div>

              <div v-if="blnMaintenanceSystems === false" class="pb-1"></div>
<!-- ==================================================================== -->
<!-- ========================= Finished Systems ========================= -->
<!-- ==================================================================== -->
              <a-tooltip placement="right" :title=" blnFinishedSystems === true ? `Hide`: `Show`">
                <div class="MyDiv3" @click="ShowFinishedSystems()">
                  <v-card-title class="pt-0 pb-0" :style="`font-size:16px;font-weight:bold;`">
                    <v-icon v-if="blnFinishedSystems === true" left color="white" large>mdi-chevron-down</v-icon>
                    <v-icon v-else-if="blnFinishedSystems === false" left color="white" large>mdi-chevron-left</v-icon>
                    <v-icon class="pl-3" left color="blue">mdi-alpha-f-circle-outline</v-icon>Finished Systems ({{intFinishedSystems}})
                  </v-card-title>
                </div>
              </a-tooltip>

              <div v-if="blnFinishedSystems === true">
                <v-card-text>
                  <a-list class="MyDiv2" size="small" item-layout="horizontal" :style="intFinishedSystems !== 0 ? `max-height: calc(100vh - 514px); min-height: calc(100vh - 514px)` : `max-height: calc(100vh - 692px); min-height: calc(100vh - 692px)`" :data-source="FinishedSystems()" bordered>
                    <a-list-item class="pl-3 pt-3 pb-3" slot="renderItem" slot-scope="item">

                      <a-list-item-meta>
                        <a-avatar class="mt-1" :src="item.Avatar" slot="avatar" size="large" shape="square">
                          {{item.ProjectName.substring(0, 1).toUpperCase()}}
                        </a-avatar> 

                        <span slot="title">
                          <v-icon v-if="item.Type === 1" left color="red">mdi-new-box</v-icon>
                          <v-icon v-else-if="item.Type === 2" left color="green">mdi-registered-trademark</v-icon>
                          <v-icon v-else-if="item.Type === 3" left color="black">mdi-tools</v-icon>
                          <v-icon v-else-if="item.Type === 5" left color="orange">mdi-alpha-m-box-outline</v-icon>
                          <v-icon v-else-if="item.Type === 6" left color="purple">mdi-alpha-i-circle-outline</v-icon>
                          <a-tooltip placement="right" :title="`Double click here to open Project's GitLab Page`">
                            <a :style="`font-size:17px;text-decoration: underline;`" @dblclick="OpenProjectPage(item.ProjectID, item.ProjectName, `Page`)">{{item.ProjectName}}</a>
                          </a-tooltip>
                        </span>
                      </a-list-item-meta>

                      <div class="pr-8">
                        <a-tooltip placement="right" :title="`Double click here to open Project's GitLab Issues Page`">
                          <a :style="`font-size:13px;text-decoration: underline;`" @dblclick="OpenProjectPage(item.ProjectID, item.ProjectName, `Issues`)">
                            <span class="ma-0 text-right">
                              <v-progress-linear rounded slot="extra" height="25" style="width: 100px" :value="item.ProjectPercentage">
                                <template v-slot="{value}">{{value}}%</template>
                              </v-progress-linear>
                            </span>
                          </a>
                        </a-tooltip>
                      </div>

                      <div class="pr-5">
                        <v-icon small class="pr-1">mdi-file-cabinet</v-icon>
                        <a-tooltip placement="right" :title="`Double click here to open Project's Project List Page`">
                          <a :style="`font-size:13px;text-decoration: underline;`" @dblclick="OpenProjectPage(item.ProjectID, item.ProjectName, `Project List`)">Project List</a>
                        </a-tooltip>

                        <v-spacer></v-spacer>

                        <v-icon small class="pr-1">mdi-newspaper</v-icon>
                        <a-tooltip placement="right" :title="`Double click here to open Project's GitLab Wiki Page`">
                          <a :style="`font-size:13px;text-decoration: underline;`" @dblclick="OpenProjectPage(item.ProjectID, item.ProjectName, `Wiki`)">Wiki</a>
                        </a-tooltip>
                      </div>

                    </a-list-item>
                  </a-list>
                </v-card-text>
              </div>

            </template>
          </v-card>
        </v-scroll-y-reverse-transition>
      </v-col>
    </v-row>
<!-- *************************************************************************************************** -->
<!-- ========================================= Task Monitoring ========================================= -->
<!-- *************************************************************************************************** -->
    <a-modal v-model="blnExportTaskMonitoring" title="Task Monitoring Board" :maskClosable="false" width="800px">
      <template slot="footer">
        <v-layout>
          <span style="padding-top:5px;padding-left:10px">
            Projects: 
            <span v-if="blnTaskMonitoringDataLoading === false && strExportSection != undefined" style="font-weight:bold">
              {{compGetTaskMonitoringCount}}
            </span>
          </span>

          <v-spacer></v-spacer>

          <a-button style="margin-right:20px;" :disabled="compCheckData" :loading="blnTaskMonitoringDataLoading === true" key="submit" icon="file-pdf" type="primary" @click="PrintPDF()">Print</a-button>

          <!-- <a-button style="margin-right:20px;" key="back" @click="blnExportTaskMonitoring = false">Cancel</a-button> -->
          <!-- <download-excel :data="objExport" :name="strFileName" worksheet="Task Monitoring"> 
            <a-button style="margin-right:20px;" :disabled="compCheckData" :loading="blnTaskMonitoringDataLoading === true" key="submit" @click="ExportTaskMonitoring()" icon="export" type="primary">Export</a-button>
          </download-excel> -->

        </v-layout>
      </template>

      <div class="MyDiv5">
        <div class ="MyDiv6">
          <v-row>
            <v-col cols="6" style="padding-top: 0px">
              <a-select showSearch :filter-option="FilterOption" v-model="strExportSection" placeholder="Section" @change="GetExportSectionTeams(), LoadExportData(), ClearOtherFields()" style="width: 100%">
                <a-select-option v-for="item in objSections" :key="item.SectionID" :value="item.SectionID" >{{item.SectionName}}</a-select-option>
              </a-select>
            </v-col>

            <v-col cols="6" style="padding-top: 0px">
              <a-select showSearch :filter-option="FilterOption" allowClear v-model="strExportTeam" placeholder="Team" @change="PromiseCheckExportList()" style="width: 100%">
                <a-select-option v-for="item in objExportTeams" :key="item.TeamID" :value="item.TeamID" >{{item.TeamName}}</a-select-option>
              </a-select>
            </v-col>
          </v-row>

          <v-row v-if="blnAdministrator">
            <v-col cols="9" style="padding-top: 0px">
                <a-select showSearch :filter-option="FilterOption" allowClear v-model="strExportProject" :disabled="blnTaskMonitoringDataLoading === true" placeholder="Project" @change="GetProjectGitLabID()" style="width: 100%">
                  <a-select-option v-for="item in objExportProjectList" :key="item.ID" :value="item.ID" >{{item.Name}}</a-select-option>
                </a-select>
            </v-col>

            <v-col cols="3" style="padding-top: 0px;"> 
              <a-tooltip placement="right">
                <span v-if="compCheckFields" slot="title">Fill-up Section, Team, and Project fields</span>
                <a-button style="width:165px;" block :disabled="compCheckFields" key="submit" icon="plus" type="primary" @click="SaveProjectToTaskMonitoring(strExportSection, strExportTeam, strExportProject, intProjectGitLabID)">Add to List</a-button>
              </a-tooltip>
            </v-col>
          </v-row>
        </div>
      </div>

      <br>

      <div class="MyDiv7">
        <div class ="MyDiv8">
          <a-list class="MyDiv9" :data-source="compFilteredTaskMonitoringList" :loading="blnTaskMonitoringDataLoading" size="small" item-layout="horizontal" bordered>
              <a-list-item :id="item.ProjectGitLabID" slot="renderItem" slot-scope="item">

                <a-list-item-meta>
                  <a-avatar style="margin-top:8px;" :src="item.Avatar" slot="avatar" shape="square">
                    {{item.Name.substring(0, 1).toUpperCase()}}
                  </a-avatar> 

                  <span slot="title" :style="`font-size:15px;`">
                    <v-icon v-if="item.Type === 1" left style="color:red;">mdi-new-box</v-icon>
                    <v-icon v-else-if="item.Type === 2" left style="color:green;">mdi-registered-trademark</v-icon>
                    <v-icon v-else-if="item.Type === 3" left style="color:black;">mdi-tools</v-icon>
                    <v-icon v-else-if="item.Type === 5" left style="color:orange;">mdi-alpha-m-box-outline</v-icon>
                    <v-icon v-else-if="item.Type === 6" left style="color:purple;">mdi-alpha-i-circle-outline</v-icon>
                    
                    <a-tooltip placement="right" :title="`Double click here to open Project's GitLab Page`">
                      <a :style="`font-size:14px;text-decoration: underline;`" @dblclick="OpenProjectPage(item.ProjectGitLabID, item.Name, `Page`)">{{item.Name}}</a>
                    </a-tooltip>
                  </span>

                  <span slot="description">
                    Section:
                    <span style="margin-right:10px;color:black;">
                      {{GetSectionName(item.SectionID)}}
                    </span>
                    Team:
                    <span style="margin-right:60px;color:black;">
                      {{GetTeamName(item.SectionID, item.TeamID)}}
                    </span>
                  </span>
                </a-list-item-meta>

                <div style="padding-right:30px;text-align:left;width:150px;">
                  <a-tooltip placement="right" :title="`Click to view project member(s)`">
                    <a @click="GetProjectMembers(item.MemberIDs)">
                      <v-icon style="color:#bc4345;">mdi-account-group</v-icon>
                    </a>
                  </a-tooltip>

                  <v-spacer></v-spacer>

                  <span style="font-size:12px;">
                    Due Date: {{`${item.ExpectedReleaseDate != null && item.ExpectedReleaseDate != undefined && item.ExpectedReleaseDate != '' ? moment(item.ExpectedReleaseDate).format(`YYYY-MM-DD`) : 'N/A'}`}}
                  </span>

                  <!-- <a-tooltip placement="right" :title="`${item.ExpectedReleaseDate != null && item.ExpectedReleaseDate != undefined && item.ExpectedReleaseDate != '' ? 'Due Date: ' + moment(item.ExpectedReleaseDate).format(`YYYY-MM-DD`) : 'Due Date: N/A'}`">
                    <v-icon style="color:#3c6bc3;">mdi-calendar-alert</v-icon>
                  </a-tooltip> -->
                </div>

                <div>
                  <a-progress type="dashboard" gapPosition="bottom" :gapDegree="1" :strokeWidth="10" :width="50" :percent="item.Percentage"></a-progress>
                </div>
                
                <div slot="extra" style="padding-left:30px;">
                  <div v-if="blnAdministrator">
                    <a-tooltip placement="right" :title="`Remove from list`">
                      <a @click="RemoveFromList(item)">
                        <v-icon left style="color:red;">mdi-delete-outline</v-icon>
                      </a>
                    </a-tooltip>
                  </div>
                </div>

              </a-list-item>
          </a-list>
        </div>
      </div>
    </a-modal>
<!-- ==================================================================== -->
<!-- ============================== Members ============================= -->
<!-- ==================================================================== -->
    <a-modal v-model="blnMembers" title="Project Member(s)" :closable="false" width="500px">
      <template slot="footer">
        <v-layout>
        </v-layout>
      </template>

      <a-list :data-source="objProjectMembers" item-layout="horizontal" bordered>
        <a-list-item :id="item.ID" slot="renderItem" slot-scope="item">
          <a-list-item-meta>
            <a-avatar style="margin-top:8px;" :src="item.Avatar" :size="60" slot="avatar" shape="square">
              {{item.Name.substring(0, 1).toUpperCase()}}
            </a-avatar> 
          </a-list-item-meta>

          <span :style="`font-size:20px;width:300px;`">
            {{item.Name}}
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
  import axios from 'axios'
  import moment from 'moment'
  import _ from 'lodash'
  import pdfMake from "pdfmake/build/pdfmake";
  import pdfFonts from "pdfmake/build/vfs_fonts";
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  export default {
// ******************************************************************************* //
// ===================================== Data ==================================== //
// ******************************************************************************* //
    data(){
      return{
        blnURLNotFound: false,
        blnMounted: false,
        blnLoading: false,
        blnNewSystems: false,
        blnMaintenanceSystems: false,
        blnFinishedSystems: false,
        blnExportTaskMonitoring: false,
        blnTaskMonitoringDataLoading: false,
        blnExportList: false,
        blnMembers: false,

        intPageNo: 1,
        intRowNo: 10,
        intNewSystems: 0,
        intMaintenanceSystems: 0,
        intFinishedSystems: 0,
        intPercentage: 0,
        intTaskMonitoringPercentage: 0,
        intProjectGitLabID: 0,

        strFilterSections: undefined,
        strFilterTeams: undefined,
        strFilterProgrammer: undefined,
        strExportSection: undefined,
        strExportTeam: undefined,
        strExportProject: undefined,
        strFileName: undefined,
        ProgrammerID: '',
        Programmer: '',
        ProgrammerAvatar: '',

        objSections: [],
        objTeams: [],
        objFilteredTeams: [],
        objProgrammersData: [],
        objProgrammerProjects: [],
        objOnGoingNewSystems: [],
        objOnGoingMaintenanceSystems: [],
        objFinishedSystems: [],
        objExportTeams: [],
        objExportProjectList: [],
        objExportTaskMonitoring: [],
        objToExport: [],
        objExport: [],
        objProjectMembers: [],
        objPagination: [{No: 0}, {No: 10}, {No: 20}, {No: 30}, {No: 40}, {No: 50},],
      }
    },
// ******************************************************************************* //
// =================================== Mounted =================================== //
// ******************************************************************************* //
    mounted(){
      this.blnMounted = true
    },
// ******************************************************************************* //
// =================================== Created =================================== //
// ******************************************************************************* //
    created(){
      this.onLoad()
      this.GetSections()
      this.GetTeams()
    },
// ******************************************************************************* //
// =================================== Computed =================================== //
// ******************************************************************************* //
    computed:{
      compCheckData(){
        let result = false
        if(this.objExportTaskMonitoring === null || this.objExportTaskMonitoring === undefined || this.objExportTaskMonitoring === [] || this.objExportTaskMonitoring.length === 0){
          result = true
        }
        if(this.strExportTeam !== undefined && this.blnExportList === false){
          result = true
        }
        return result
      },
      compFilteredTaskMonitoringList(){
        let data = this.objExportTaskMonitoring
        if(this.strExportTeam !== undefined){
          data = data.filter(rec => {
            return rec.TeamID === this.strExportTeam
          })
        }
        let result_data = this.SortTaskMonitoring(data)
        return result_data
      },
      compGetTaskMonitoringCount(){
        let TaskMonitoringCount = this.objToExport.length
        return TaskMonitoringCount
      },
      compCheckFields(){
        let result = false
        if((this.strExportSection === undefined || this.strExportSection === null || this.strExportSection === "") ||
           (this.strExportTeam === undefined || this.strExportTeam === null || this.strExportTeam === "") ||
           (this.strExportProject === undefined || this.strExportProject === null || this.strExportProject === "")){
          result = true
        }
        return result
      },
      compFilteredProgrammerList(){
        let data = this.objProgrammersData
        if(this.strFilterSections !== undefined){
          data = data.filter(rec => {
            return rec.SectionID === this.strFilterSections
          })
        }
        if(this.strFilterTeams !== undefined){
          data = data.filter(rec => {
            return rec.TeamID === this.strFilterTeams
          })
        }
        if(this.strFilterProgrammer !== undefined){
          data = data.filter(rec => {
            return rec.Name.toUpperCase().includes(this.strFilterProgrammer.toUpperCase())
          })
        }
        return data
      },
      compPageCount(){
        let l = this.compFilteredProgrammerList.length
        let s = this.intRowNo != 0 ? this.intRowNo : this.compFilteredProgrammerList.length
        return Math.ceil(l / s)
      },
      compPagedData(){
        let s = this.intRowNo != 0 ? this.intRowNo : this.compFilteredProgrammerList.length
        let start = (this.intPageNo - 1) * s
        let end = start + s
        return this.compFilteredProgrammerList.slice(start, end)
      },
      compSortedOnGoingNewSystems(){
        let Systems = this.objOnGoingNewSystems
        Systems = Systems.sort((a,b) => {
          let aPercentage = a.ProjectPercentage
          let bPercentage = b.ProjectPercentage
          if(aPercentage < bPercentage){
            return -1
          }
        })
        return Systems
      },
      compSortedOnGoingMaintenanceSystems(){
        let Systems = this.objOnGoingMaintenanceSystems
        Systems = Systems.sort((a,b) => {
          let aPercentage = a.ProjectPercentage
          let bPercentage = b.ProjectPercentage
          if(aPercentage < bPercentage){
            return -1
          }
        })
        return Systems
      },
      compSortedFinishedSystems(){
        let Systems = this.objFinishedSystems
        Systems = Systems.sort((a,b) => {
          let aName = a.Name
          let bName = b.Name
          if(aName < bName){
            return -1
          }
        })
        return Systems
      },
    },
// ******************************************************************************* //
// =================================== Methods =================================== //
// ******************************************************************************* //
    methods:{
// ======================================================================== //
// ========================= Get Programmers Data ========================= //
// ======================================================================== //
      async GetProgrammersData(){
        try{
          this.objProgrammersData = await this.PromiseGetProgrammersData()
        }
        catch(err){
          console.log('GetProgrammersData', err)
        }
      },
      PromiseGetProgrammersData(){
        return new Promise( resolve => {
          const url = `${this.api}/GetProgrammers`
          axios.get(url).then(res => {
            resolve(res.data)
          })
        })
      },
      GetSections(){
        let SectionsUrl = `${this.api}/Sections`
        axios.get(SectionsUrl).then((Sections) => {
          this.objSections = Sections.data.filter(SectionDetails => {
            return(SectionDetails.SectionID !== 5)
          })
        })
        .catch((err) => {
          console.log('GetSections', err)
          console.log('GetSections', SectionsUrl)
        })
      },
      GetSectionName(ID){
        let SectionData = this.objSections.find((Section) => {
          return Section.SectionID === ID
        })
        if(SectionData != undefined){
          return SectionData.SectionName
        }
        else{
          return ""
        }
      },
      GetTeams(){
        let TeamsUrl = `${this.api}/Teams`
        axios.get(TeamsUrl).then((Teams) => {
          this.objTeams = Teams.data
        })
        .catch((err) => {
          console.log('GetTeams', err)
          console.log('GetTeams', TeamsUrl)
        })
      },
      GetSectionTeams(){
        let TeamsObj = this.objTeams
        if(this.strFilterSections != undefined){
          this.objFilteredTeams = TeamsObj.filter(TeamDetails => {
            return(TeamDetails.SectionID === this.strFilterSections)
          })
        }
        else{
          this.objFilteredTeams = undefined
        }
      },
      GetTeamName(SectionID, TeamID){
        let TeamData = this.objTeams.find((Team) => {
          return Team.SectionID === SectionID && Team.TeamID === TeamID
        })
        if(TeamData != undefined){
          return TeamData.TeamName
        }
        else{
          return ""
        }
      },
// ======================================================================== //
// =========================== Get Projects Data ========================== //
// ======================================================================== //
      async GetProgrammerProjects(){
        try{
          this.blnLoading = true
          this.objProgrammerProjects = await this.PromiseGetProgrammerProjects()
          await this.PromiseCheckProgrammerProjects(this.objProgrammerProjects)
        }
        catch(err){
          console.log('GetProgrammerProjects', err)
        }
      },
      PromiseGetProgrammerProjects(){
        return new Promise( resolve => {
          const url = `${this.api}/GetProgrammersProjects`
          axios.get(url).then(res => {
            resolve(res.data)
          })
        })
      },
      PromiseCheckProgrammerProjects(projects_array){
        let TotalProjects = projects_array.filter(rec => { return rec.Gitlab_ID != null }).length
        let ProjectCounter = 0
        let Included = 0

        return new Promise(resolve => {
          projects_array.forEach(ProjectDetails => {
            if(ProjectDetails.Gitlab_ID != null){
              const MembersAPI = `${this.$store.state.gitlab_api}/api/v4/projects/${ProjectDetails.Gitlab_ID}/members?private_token=mxus9a5iYWGjkw_TqTsD`
              axios.get(MembersAPI).then(Members => {
                const checkIfInclude = Members.data.map(MembersDetails => {return MembersDetails.id}).includes(this.ProgrammerID)
                if(checkIfInclude){
                  ProjectCounter++
                  Included++
                  const IssuesAPI = `${this.$store.state.gitlab_api}/api/v4/projects/${ProjectDetails.Gitlab_ID}/issues?private_token=mxus9a5iYWGjkw_TqTsD&page=1&per_page=100`
                  axios.get(IssuesAPI).then(Issues => {
                    const checkIfOnGoing = Issues.data.map(IssuesDetails => {return IssuesDetails.state}).includes("opened")
                    if(ProjectDetails.Gitlab_ID !== null && ProjectDetails.Gitlab_ID !== "" && ProjectDetails.Gitlab_ID !== undefined){
                      const StatisticsAPI = `${this.$store.state.gitlab_api}/api/v4/projects/${ProjectDetails.Gitlab_ID}/issues_statistics?private_token=mxus9a5iYWGjkw_TqTsD`
                      axios.get(StatisticsAPI).then((StatisticsDetails) => {
                        this.intPercentage = 0
                        const value = StatisticsDetails.data
                        const All = value.statistics.counts.all
                        const Closed = value.statistics.counts.closed
                        this.intPercentage = Math.ceil((Closed / All) * 100)
                        if(checkIfOnGoing || All == 0){
                          if(ProjectDetails.Type === 1 || ProjectDetails.Type === 2 ||  ProjectDetails.Type === 5 ||  ProjectDetails.Type === 6){
                            this.objOnGoingNewSystems.push({ProjectID: ProjectDetails.Gitlab_ID, ProjectName: ProjectDetails.Name, Avatar: ProjectDetails.Avatar, Type: ProjectDetails.Type, ProjectPercentage: this.intPercentage})
                            this.intNewSystems++
                          }
                          else if(ProjectDetails.Type === 3){
                            this.objOnGoingMaintenanceSystems.push({ProjectID: ProjectDetails.Gitlab_ID, ProjectName: ProjectDetails.Name, Avatar: ProjectDetails.Avatar, Type: ProjectDetails.Type, ProjectPercentage: this.intPercentage})
                            this.intMaintenanceSystems++
                          }
                        }
                        else{
                          this.objFinishedSystems.push({ProjectID: ProjectDetails.Gitlab_ID, ProjectName: ProjectDetails.Name, Avatar: ProjectDetails.Avatar, Type: ProjectDetails.Type, ProjectPercentage: this.intPercentage})
                          this.intFinishedSystems++
                        }
                        this.mFinalCheck(TotalProjects, ProjectCounter, Included)
                      })
                    }
                  })
                }
                else{
                  ProjectCounter++
                  this.mFinalCheck(TotalProjects, ProjectCounter, Included)
                }
                resolve(Members.data)
              })
              .catch(() => {
                ProjectCounter++
                this.mFinalCheck(TotalProjects, ProjectCounter, Included)
              })
            }
          })
        })
      },
      mFinalCheck(TotalProjects, ProjectCounter, Included){
        if(TotalProjects == ProjectCounter){
          if(Included == (this.intNewSystems + this.intMaintenanceSystems + this.intFinishedSystems)){
            if(this.intNewSystems > 0){this.blnNewSystems = true}
            if(this.intMaintenanceSystems > 0){this.blnMaintenanceSystems = true}
            if(this.intFinishedSystems > 0){this.blnFinishedSystems = true}
            this.blnLoading = false
          }
        }
      },
// =============================================================================== //
// =========================== Get Task Monitoring Data ========================== //
// =============================================================================== //
      OpenExportTaskMonitoringForm(){
        this.objExportTaskMonitoring = undefined
        this.strExportSection = undefined
        this.strExportTeam = undefined
        this.strExportProject = undefined
        this.blnExportTaskMonitoring = true
        if(this.$store.state.sObjUserInfo != ""){
          this.GetLoginUserSection()
        }
      },
      async LoadExportData(){
        try{
          await this.PromiseGetTaskMonitoring()
          await this.PromiseGetExportProjects()
          await this.PromiseGetTaskMonitoringMembers()
          await this.PromiseCheckExportList()
        }
        catch(err){
          console.log('LoadExportData', err)
        }
      },
      GetLoginUserSection(){
        const url = `${this.api}/GetProgrammerLogin`
        axios.get(url).then(Users => {
          let UserData = Users.data.find((User) => {
            return User.Email === this.sObjUserInfo
          })
          if(UserData != undefined && UserData != null && UserData != ""){
            if(UserData.SectionID != undefined && UserData.SectionID != null && UserData.SectionID != ""){
              this.strExportSection = UserData.SectionID
            }
          }
          else{
            this.strExportSection = undefined
          }
        }).catch(err =>{
          console.log('GetLoginUserSection', err)
          console.log('GetLoginUserSection', url)
        }).finally(() => {
          if(this.strExportSection != undefined){
            this.GetExportSectionTeams()
            this.LoadExportData()
          }
        })
      },
      GetExportSectionTeams(){
        let TeamsObj = this.objTeams
        if(this.strExportSection != undefined){
          this.objExportTeams = TeamsObj.filter(TeamDetails => {
            return(TeamDetails.SectionID === this.strExportSection)
          })
        }
        else{
          this.objExportTeams = undefined
        }
      },
      GetProjectGitLabID(){
        if(this.strExportProject != undefined){
          const url = `${this.api}/GetProjectGitLabID?ID=${this.strExportProject}`
          axios.get(url).then(Project => {
            this.intProjectGitLabID = Project.data[0].Gitlab_ID
          })
        }
      },
      GetProjectMembers(data){
        this.objProjectMembers = []
        if(data !== null && data !== undefined){
          let IDs = data.split(',')
          IDs.forEach(ID => {
            let url = `${this.api}/CheckMembers?ID=${ID}`
            axios.get(url).then(Member => {
              let MemberData = Member.data
              let toPushProjectMembers = MemberData.map(Member=>{ return { ID: Member.ID, Avatar: Member.Avatar, Name: Member.Name }})[0]
              this.objProjectMembers.push(toPushProjectMembers)
            })
          })
        }
        this.blnMembers = true
      },
      PromiseCheckExportList(){
        return new Promise(resolve => {
          let data = this.objExportTaskMonitoring
          if(this.strExportTeam !== undefined){
            data = data.filter(rec => { return rec.TeamID === this.strExportTeam })
            if(data.length > 0){
              this.blnExportList = true
            }
            else{
              this.blnExportList = false
            }
          }
          resolve(this.blnExportList)
        })
      },
      PromiseGetTaskMonitoring(){
        return new Promise(resolve => {
          this.blnTaskMonitoringDataLoading = true
          this.objExportTaskMonitoring = []
          let tmpObjExportTaskMonitoring = []
          const url = `${this.api}/GetTaskMonitoring?SectionID=${this.strExportSection}`
          axios.get(url).then(Projects => {
            if(Projects.data.length > 0){
              Projects.data.forEach(ProjectDetails => {
                const StatisticsAPI = `${this.$store.state.gitlab_api}/api/v4/projects/${ProjectDetails.ProjectGitLabID}/issues_statistics?private_token=mxus9a5iYWGjkw_TqTsD`
                axios.get(StatisticsAPI).then((StatisticsDetails) => {
                  this.intTaskMonitoringPercentage = 0
                  const value = StatisticsDetails.data
                  const All = value.statistics.counts.all
                  const Closed = value.statistics.counts.closed
                  if(All !== 0){
                    this.intTaskMonitoringPercentage = Math.ceil((Closed / All) * 100)
                  }
                  tmpObjExportTaskMonitoring.push({TeamID: ProjectDetails.TeamID,
                                                  TeamName: ProjectDetails.TeamName,
                                                  SectionID: ProjectDetails.SectionID,
                                                  SectionName: ProjectDetails.SectionName,
                                                  SystemMonitoringID: ProjectDetails.SystemMonitoringID,
                                                  ProjectGitLabID: ProjectDetails.ProjectGitLabID,
                                                  Name: ProjectDetails.Name,
                                                  Avatar: ProjectDetails.Avatar,
                                                  Type: ProjectDetails.Type,
                                                  TypeName: ProjectDetails.Type === 1 ? "New System"
                                                          : ProjectDetails.Type === 2 ? "Remake"
                                                          : ProjectDetails.Type === 3 ? "Maintenance"
                                                          : ProjectDetails.Type === 4 ? "KSK"
                                                          : ProjectDetails.Type === 5 ? "Magic V8"
                                                          : ProjectDetails.Type === 6 ? "iCAD"
                                                          : "",   
                                                  Percentage: this.intTaskMonitoringPercentage,
                                                  ExpectedReleaseDate: ProjectDetails.ExpectedReleaseDate})
                  this.objExportTaskMonitoring = tmpObjExportTaskMonitoring
                  resolve(this.objExportTaskMonitoring)
                })
              })
            }
            else{
              resolve(this.objExportTaskMonitoring)
            }
          }).catch(err => {
            console.log('PromiseGetTaskMonitoring', err)
            console.log('PromiseGetTaskMonitoring', url)
          })
        })
      },
      PromiseGetExportProjects(){
        return new Promise(resolve => {
          this.objExportProjectList = []
          let tempProjectList = []
          const url = `${this.api}/GetProgrammersProjects`
          axios.get(url).then(Projects => {
            tempProjectList = Projects.data.filter(ProjectDetails => {
              return(ProjectDetails.SectionID === this.strExportSection && (ProjectDetails.Gitlab_ID != null || ProjectDetails.Gitlab_ID != undefined ))
            })
            let ExistingID = this.objExportTaskMonitoring.map(TaskMonitoring => {return TaskMonitoring.SystemMonitoringID})
            tempProjectList.forEach((Project) => {
              if(!ExistingID.includes(Project.ID)){
                this.objExportProjectList.push(Project)
              }
            resolve(this.objExportProjectList)
            })
          })
        })
      },
      PromiseGetTaskMonitoringMembers(){
        return new Promise(resolve => {
          this.objToExport.forEach(Project => {
            let IDs = undefined
            let Names = undefined
            let MembersAPI = `${this.$store.state.gitlab_api}/api/v4/projects/${Project.ProjectGitLabID}/members?private_token=mxus9a5iYWGjkw_TqTsD`
            axios.get(MembersAPI).then(MemberList => {
              if(MemberList.data.length > 0){
                let Members = MemberList.data.map(MemberID => { return {ID: MemberID.id} })
                Members.forEach(Member => {
                  let CheckingAPI = `${this.api}/CheckMembers?ID=${Member.ID}`
                  axios.get(CheckingAPI).then(res => {
                    let MemberData = res.data
                    // let MemberSection = MemberData.map(Data => { return Data.SectionID })
                    // let MemberTeam = MemberData.map(Data => { return Data.TeamID})
                    // let Include = MemberData.map(Data => { return Data.BlnInclude})
                    // if((Project.SectionID === MemberSection[0]) && (Project.TeamID === MemberTeam[0]) && (Include[0] === true || Include[0] === "true" || Include[0] === 1)){
                      let ID = MemberData.map(Data => { return Data.ID })
                      let Name = MemberData.map(Data => { return Data.Name})
                      if(IDs === null || IDs === undefined || IDs === ""){
                        IDs = ID
                        Names = "• " + Name
                      }
                      else{
                        IDs = IDs + "," + ID
                        Names = Names + "\n• " + Name
                      }
                      Project.MemberIDs = IDs.toString()
                      Project.MemberNames = Names.toString()
                    // }
                  })
                })
              }
            })
          })
          this.blnTaskMonitoringDataLoading = false
          resolve(this.objToExport)
        })
      },
      SaveProjectToTaskMonitoring(SectionID, TeamID, SystemMonitoringID , ProjectGitLabID){
        let objProject = ({SectionID: SectionID, TeamID: TeamID, SystemMonitoringID: SystemMonitoringID, ProjectGitLabID: ProjectGitLabID})
        let url = `${this.api}/InsertToTaskMonitoring`
        axios.post(url, objProject).then(res => {
          console.log(res.data)
          this.$notification.success({ message: "Project Maintenance", description: "Successfully added.", })
        })
        .catch(err => {
          console.log('SaveProjectToTaskMonitoring', err)
          console.log('SaveProjectToTaskMonitoring', url)
        })
        .finally(() => {
          this.strExportProject = undefined
          this.LoadExportData()
        })
      },
      SortTaskMonitoring(data){
        let Projects = data
        if(Projects != undefined){
          this.objToExport = Projects.sort((a,b) => {
            let aPercentage = a.Percentage
            let bPercentage = b.Percentage
            if(aPercentage > bPercentage){
              return -1
            }
          })
          return this.objToExport
        }
      },
      RemoveFromList(data){
        let me = this
        me.$confirm({title: "Remove this project from the list?",
                      cancelText: "No",
                      okText: "Yes",
                      content: (<div style="color:black">
                                  Project <i style="color:blue"> - {data.Name} </i>
                                </div>),
        onOk(){
            let objProject = ({SectionID: data.SectionID, TeamID: data.TeamID, SystemMonitoringID: data.SystemMonitoringID , ProjectGitLabID: data.ProjectGitLabID})
            let url = `${me.api}/RemoveFromTaskMonitoring`
            axios.post(url, objProject).then(res => {
              console.log(res.data)
              me.$notification.success({ message: "Project Maintenance", description: "Project removed from list.", })
            })
            .catch(err => {
              console.log('RemoveFromList', err)
              console.log('RemoveFromList', url)
            })
            .finally(() => {
              me.LoadExportData()
            })
        },
        onCancel(){},
        })
      },
      ExportTaskMonitoring(){
        if(this.strExportTeam === null || this.strExportTeam === undefined || this.strExportTeam === ""){
          let SectionName = this.GetSectionName(this.strExportSection)
          SectionName = SectionName.replace(" ", "")
          this.strFileName = `TaskMonitoring_${SectionName}_${moment().format("YYYYMMDD")}`
        }
        else{
          let TeamName = this.GetTeamName(this.strExportSection, this.strExportTeam)
           TeamName = TeamName.replace(" ", "")
          this.strFileName = `TaskMonitoring_${TeamName}_${moment().format("YYYYMMDD")}`
        }

        let sortedProjects = _.orderBy( this.objToExport , ['TeamName', 'Percentage', 'Name'], ['asc', 'desc', 'asc'])
        this.objExport = sortedProjects.map(Project=>{
          return {
            "Team": Project.TeamName,
            "Project Name": Project.Name,
            "In Charge": Project.MemberNames,
            "Due Date": Project.ExpectedReleaseDate != null ? moment(Project.ExpectedReleaseDate).format("YYYY/MM/DD") : "",
            "Status": Project.Percentage + "%",
            "Remarks": Project.TypeName
          }
        })
      },
      PrintPDF(){
        if(this.strExportTeam === null || this.strExportTeam === undefined || this.strExportTeam === ""){
          let SectionName = this.GetSectionName(this.strExportSection)
          SectionName = SectionName.replace(" ", "")
          this.strFileName = `${SectionName} TaskMonitoring - ${moment().format("YYYY/MM/DD")}`
        }
        else{
          let TeamName = this.GetTeamName(this.strExportSection, this.strExportTeam)
           TeamName = TeamName.replace(" ", "")
          this.strFileName = `${TeamName} TaskMonitoring - ${moment().format("YYYY/MM/DD")}`
        }

        let sortedProjects = _.orderBy( this.objToExport , ['TeamName', 'Percentage', 'Name'], ['asc', 'desc', 'asc'])
        this.objExport = sortedProjects.map(Project=>{
          return {
            "Team": Project.TeamName,
            "Project Name": Project.Name,
            "In Charge": Project.MemberNames,
            "Due Date": Project.ExpectedReleaseDate != null ? moment(Project.ExpectedReleaseDate).format("YYYY/MM/DD") : "",
            "Status": Project.Percentage + "%",
            "Remarks": Project.TypeName
          }
        })

        // Table Body
        function buildTableBody(data, columns){
          var body = []
          body.push(columns)
          data.forEach(function(row){
            var dataRow = []
            columns.forEach(function (column) {
              dataRow.push({ text:row[column], fontSize: 9, alignment: column == 'Project Name' || column == 'In Charge' ? 'left' : 'center' })
            })
            body.push(dataRow)
          })

          // Table Headers
          columns[0] = { text:'Team', alignment: 'center', bold: true , fillColor: 'gray', color: 'white'},
          columns[1] = { text:'Project Name', alignment: 'center', bold: true , fillColor: 'gray', color: 'white'},
          columns[2] = { text:'In Charge', alignment: 'center', bold: true , fillColor: 'gray', color: 'white'},
          columns[3] = { text:'Due Date', alignment: 'center', bold: true , fillColor: 'gray', color: 'white'},
          columns[4] = { text:'Status', alignment: 'center', bold: true , fillColor: 'gray', color: 'white'} ,
          columns[5] = { text:'Remarks', alignment: 'center', bold: true , fillColor: 'gray', color: 'white'}
          return body
        }

        // Column Width
        function table(data, columns){
          return {
              table: { widths: ['10%', '30%', '25%', '12%', '8%','15%'], headerRows: 1, body: buildTableBody(data, columns), },
          };
        }

        // Font
        pdfMake.fonts = {
          seguisym: { normal: 'seguisym.ttf', bold: 'seguisym.ttf', italics: 'seguisym.ttf', bolditalics: 'seguisym.ttf' }
        }

        // Page Properties
        var PrintData = {
          pageSize: 'A4',
          pageOrientation: 'portrait',
          pageMargins: [ 10, 10, 10, 20],
          content: [ { text: `${this.strFileName}`, style: 'header', },
                     { text: `${this.objExport.length}`, style: 'subheader', },
                       table(this.objExport, ['Team', 'Project Name', 'In Charge', 'Due Date', 'Status', 'Remarks'], {  }), ],

          // Content Properties
          styles: { header: { margin: [0, 0, 0, 5], fontSize: 15, alignment:'center', bold: true, color:'black' },
                    subheader: { margin: [0, 0, 10, 5], fontSize: 9, alignment:'right', bold: true, color:'black' },  },

          defaultStyle: { font: 'seguisym', fontSize: 10, alignment:'center', },

          // Page Numbering
          footer: function(currentPage, pageCount) {
            return {
              columns: [ { height: 5, fontSize: 9, alignment: 'center', text:[ { text: 'Page ' + currentPage.toString() + ' of ' + pageCount, } ] } ]
            };
          },
        }

        // PDF Printing Execution
        pdfMake.createPdf(PrintData).open() 
      },
// ======================================================================== //
// ================================ Events ================================ //
// ======================================================================== //
      onLoad(){
        this.GetProgrammersData()
      },
      ChangeName(name){
        let data = name
        data = data.replace("(", "")
        data = data.replace(")", "")
        data = data.replace(".", "")
        data = data.replace(/,/gi, "")
        data = data.replace(/ /gi, "")
        return data
      },
      ClickProgrammer(itemID, itemName, itemAvatar){
        this.blnNewSystems = false
        this.blnMaintenanceSystems = false
        this.blnFinishedSystems = false
        this.intNewSystems = 0
        this.intMaintenanceSystems = 0
        this.intFinishedSystems = 0
        this.objProgrammerProjects = []
        this.objOnGoingNewSystems = []
        this.objOnGoingMaintenanceSystems = []
        this.objFinishedSystems = []
        this.ProgrammerID = itemID
        this.Programmer = itemName
        this.ProgrammerAvatar = itemAvatar
        this.GetProgrammerProjects()
      },
      OnGoingNewSystems(){
        let Systems = this.compSortedOnGoingNewSystems
        return Systems
      },
      OnGoingMaintenanceSystems(){
        let Systems = this.compSortedOnGoingMaintenanceSystems
        return Systems
      },
      FinishedSystems(){
        let Systems = this.compSortedFinishedSystems
        return Systems
      },
      OpenProjectPage(ID, ProjectName, type){
        if(type === `Page`){
          const PageAPI = `${this.$store.state.gitlab_api}/api/v4/projects/${ID}?private_token=mxus9a5iYWGjkw_TqTsD`
          axios.get(PageAPI).then(Page => {
            let PageURL = Page.data.web_url
            window.open(PageURL, "_blank")
          })
        }
        else if(type === `Project List`){
          let ChangedProjectName = this.ChangeName(ProjectName)
          const ProjectListURL = `${process.env.VUE_APP_CLIENT}/Project?name=${ChangedProjectName}`
          window.open(ProjectListURL, "_blank")
        }
        else if(type === `Wiki`){
          const PageAPI = `${this.$store.state.gitlab_api}/api/v4/projects/${ID}?private_token=mxus9a5iYWGjkw_TqTsD`
          axios.get(PageAPI).then(Page => {
            let PageURL = Page.data.web_url
            window.open(PageURL + "/-/wikis/home", "_blank")
          })
        }
        else if(type === `Issues`){
          const PageAPI = `${this.$store.state.gitlab_api}/api/v4/projects/${ID}?private_token=mxus9a5iYWGjkw_TqTsD`
          axios.get(PageAPI).then(Page => {
            let PageURL = Page.data.web_url
            window.open(PageURL + "/-/boards", "_blank")
          })
        }
      },
      OpenProgrammerProfile(){
        const ProfileAPI = `${this.$store.state.gitlab_api}/api/v4/users/${this.ProgrammerID}?private_token=mxus9a5iYWGjkw_TqTsD`
        axios.get(ProfileAPI).then(Profile => {
          let ProfileURL = Profile.data.web_url
          window.open(ProfileURL, "_blank")
        })
      },
      FilterOption(input, option){
        return(option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
      },
      ShowNewSystems(){
        if(this.blnNewSystems === true){
          this.blnNewSystems = false
        }
        else{
          this.blnNewSystems = true
        }
      },
      ShowMaintenanceSystems(){
        if(this.blnMaintenanceSystems === true){
          this.blnMaintenanceSystems = false
        }
        else{
          this.blnMaintenanceSystems = true
        }
      },
      ShowFinishedSystems(){
        if(this.blnFinishedSystems === true){
          this.blnFinishedSystems = false
        }
        else{
          this.blnFinishedSystems = true
        }
      },
      ClearOtherFields(){
         this.strExportTeam = undefined
         this.strExportProject = undefined
      },
      NotFound(){
        this.blnURLNotFound = true
      }
    }
  }
</script>
<!-- ============================================================================================== -->
<!-- =========================================== Styles =========================================== -->
<!-- ============================================================================================== -->
<style>
  .MyAvatar1{
    cursor: pointer
  }

  .MyCard1{
    max-height: calc(100vh - 130px);
    min-height: calc(100vh - 130px);
    overflow-y: auto;
    overflow-x: auto;
  }

  .MyDiv1{
    max-height: calc(100vh - 265px);
    min-height: calc(100vh - 265px);
    overflow-y: auto;
    overflow-x: auto;
  }

  .MyDiv1 .ant-list-item:hover{
    background-color: #EEEEEA;
    cursor: pointer;
  }
  
  .MyDiv2{
    overflow-y: auto;
    overflow-x: auto;
  }

  .MyDiv2 .ant-list-item:hover{
    background-color: #EEEEEA;
  }
  
  .MyDiv3{
    background-color: #585e5e;
    color:white;
    max-height: 35px;
    min-height: 35px;
  }
  
  .MyDiv3 :hover{
    background-color: #414444;
    cursor: pointer;
  }
  
  .MyDiv4{
    transition: width 0.8s;
  }
  
  .MyDiv5{
    border:1px solid rgb(194, 193, 193);
    border-radius: 15px 15px 0px 0px;
  }
  
  .MyDiv6{
    margin-top:13px;
    margin-left:10px;
    margin-right:10px;
  }
  
  .MyDiv7{
    border:1px solid rgb(194, 193, 193);
    border-radius: 0px 0px 15px 15px;
  }
  
  .MyDiv8{
    margin-top:13px;
    margin-left:10px;
    margin-right:10px;
    margin-bottom:13px;
  }

  .MyDiv9{
    max-height: calc(100vh - 450px);
    min-height: calc(100vh - 450px);
    overflow-y: auto;
    overflow-x: auto;
  }

  .Header{
    max-height: calc(100vh - 780px);
    min-height: calc(100vh - 780px);
    animation: .2s ease-out 0s 1 slideInFromLeft;
  }

  @keyframes slideInFromLeft{
    0%    {transform: translateX(-100%);}
    100%  {transform: translateX(0);}
    from  {opacity: 0}
    to    {opacity: 1}
  }

  .v-progress-linear__content{
    z-index: 1;
  }

  .v-application ul, .v-application ol{
    padding-left: 0px
  }
</style>