<template>
  <div>
<!-- ******************************************************************************************** -->
<!-- ====================================== 404 Not Found ======================================= -->
<!-- ******************************************************************************************** -->
    <a-result v-if="blnURLFound" status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
      <template #extra>
        <a-button @click="mChangeRouter()" type="primary">Back Home</a-button>
      </template>
    </a-result>
<!-- ******************************************************************************************** -->
<!-- ========================================== Header ========================================== -->
<!-- ******************************************************************************************** -->
    <v-row v-else no-gutters>
      <v-col cols="12">
        <v-scroll-y-transition>
          <v-card class="mx-2 mb-1" tile>
            <v-card-text class="pt-0 pb-0">
              <v-tabs v-model="intType" @change="(intPageNo = 1), mChangeSearch()" dense center-active grow centered icons-and-text>
                <!-- :disabled="mProjectLength(0) == 0" --> <v-tab> ALL({{ mProjectLength(0) }}) <v-icon color="blue">mdi-file-cabinet</v-icon></v-tab>
                <!-- :disabled="mProjectLength(1) == 0" --> <v-tab> NEW({{ mProjectLength(1) }}) <v-icon color="red">mdi-new-box</v-icon></v-tab>
                <!-- :disabled="mProjectLength(2) == 0" --> <v-tab> REMAKE({{ mProjectLength(2) }}) <v-icon color="green">mdi-registered-trademark</v-icon> </v-tab>
                <!-- :disabled="mProjectLength(3) == 0" --> <v-tab> MAINTENANCE({{ mProjectLength(3) }}) <v-icon color="black">mdi-tools</v-icon> </v-tab>
                <!-- :disabled="mProjectLength(4) == 0" --> <v-tab> KSK({{ mProjectLength(4) }}) <v-icon color="black">mdi-alpha-k-box</v-icon> </v-tab> <!-- 2021-02-18 -->
                <!-- :disabled="mProjectLength(5) == 0" --> <v-tab> MAGIC V8({{ mProjectLength(5) }}) <v-icon color="orange">mdi-alpha-m-box-outline</v-icon> </v-tab> <!-- 2021-02-18 -->
                <!-- :disabled="mProjectLength(6) == 0" --> <v-tab style="text-transform:none;"> iCAD({{ mProjectLength(6) }}) <v-icon color="purple">mdi-alpha-i-circle-outline</v-icon> </v-tab> <!-- 2021-02-23 -->
                <!-- :disabled="mProjectLength(7) == 0" --> <v-tab v-if="blnAdministrator"> DISPOSED({{ mProjectLength(7) }}) <v-icon color="red">mdi-delete-outline</v-icon> </v-tab> <!-- 2021-02-18 -->
              </v-tabs>

              <v-row justify="space-around">
                <v-col cols="3">
                  <a-input-search allowClear v-model="strSearch" placeholder="Project Name" @input="(intPageNo = 1), mChangeSearch()"/>
                </v-col>

                <v-col cols="3">
                  <a-select showSearch :filter-option="filterOption" allowClear v-model="strFilterCompanies" placeholder="Company User" @change="(intPageNo = 1), mChangeSearch(), (strFilterDepartments = undefined)" style="width: 100%">
                    <a-select-option v-for="item in objCompanies" :key="item.CompanyName" :value="item.CompanyName">{{ item.CompanyName }}</a-select-option>
                  </a-select>
                </v-col>

                <v-col cols="2">
                  <a-select showSearch :filter-option="filterOption" allowClear v-model="strFilterDepartments" placeholder="Department User" @change="(intPageNo = 1), mChangeSearch()" style="width: 100%">
                    <a-select-option v-for="item in filteredDepartmentsU" :key="item.DepartmentName" :value="item.DepartmentName">{{ item.DepartmentName }}</a-select-option>
                  </a-select>
                </v-col>

                <v-col cols="2">
                  <a-select showSearch :filter-option="filterOption" allowClear v-model="strFilterSections" placeholder="HRD-QA Sec Incharge" @change="(intPageNo = 1), mChangeSearch()" style="width: 100%">
                    <a-select-option v-for="item in objSections" :key="item.SectionID" :value="item.SectionID">{{ item.SectionName }}</a-select-option>
                  </a-select>
                </v-col>

                <v-col cols="2">
                  <a-select showSearch :filter-option="filterOption" allowClear v-model="strFilterProjectOwner" placeholder="System Developer" @change="(intPageNo = 1), mChangeSearch()" style="width: 100%">
                    <a-select-option v-for="item in objProjectOwner" :key="item.ProjectOwner" :value="item.ProjectOwner">{{ item.ProjectOwner }}</a-select-option>
                  </a-select>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-scroll-y-transition>
      </v-col>
<!-- ******************************************************************************************** -->
<!-- ================================== Project List ============================================ -->
<!-- ******************************************************************************************** -->
      <v-col cols="6">
        <v-scroll-y-transition>
          <v-card class="mx-2" id="MyCard1" tile v-if="blnMounted">
            <v-card-title>
              <v-icon left>mdi-file-cabinet</v-icon>Project List
              <v-spacer></v-spacer>
              <a-button @click="mAddnew()" type="primary" icon="plus-circle" v-if="blnAdministrator">Add New</a-button>
              <v-spacer></v-spacer>
              <a-button :loading="blnLoading" @click="mGetAllProjectPercentage(), (blnAsc = !blnAsc)" type="primary" :icon="!blnAsc ? 'sort-ascending' : 'sort-descending'"> Sort {{ !blnAsc ? "Asc" : "Desc" }}</a-button>
            </v-card-title>

            <v-card-text class="py-0">
              <a-list :loading="blnLoading" id="MyDiv2" size="small" item-layout="horizontal" :data-source="cPaginatedData" bordered>
                <a-list-item :id="mChangeSpace(item.Name)" slot="renderItem" slot-scope="item" :style="`background-color:${ objInfo.ID == item.ID ? '#90CAF9' : item.Gitlab_ID == null ? '#7CB342' : ''}`">
                  
                  <a-list-item-meta @click="mClickProject(item)">
                    <a-avatar slot="avatar" size="large" class="mt-1" shape="square" :src="item.Avatar">{{ item.Name.substring(0, 1).toUpperCase() }}</a-avatar>

                    <span slot="title">
                      <a-tooltip placement="right" :title=" item.URL == null ? '' : 'Double click to open project' ">
                        <a v-if="item.URL != null" :style="`font-size:17px;color:${ item.Name != mFindGitlabName(item.Gitlab_ID) ? item.Gitlab_ID == null ? '' : 'red' : '' };text-decoration: underline;`" @dblclick="mOpenURL(item.URL)">{{ item.Name }}</a>
                        <span v-else :style="`font-size:17px;color:${ item.Name != mFindGitlabName(item.Gitlab_ID) ? item.Gitlab_ID == null ? '' : 'red' : 'black' }`">{{ item.Name }}</span>
                      </a-tooltip>
                    </span>

                    <span slot="description">
                      Section Incharge:
                      <span class="black--text">
                        {{ mGetSectionName(item.SectionID) }}
                      </span>
                    </span>
                  </a-list-item-meta>
                  
                  <div slot="extra">
                    <span class="ma-0 text-right">
                      <v-progress-linear rounded slot="extra" height="20" style="width: 75px" :value="mGetProjectsPercentage(item.Gitlab_ID)">
                        <template v-slot="{ value }">{{ value }}%</template>
                      </v-progress-linear>
                    </span>
                  </div>

                </a-list-item>
              </a-list>
<!-- ==================================================================== -->
<!-- ============================ Pagination ============================ -->
<!-- ==================================================================== -->
              <div>
                <v-row no-gutters justify="center" class="mt-2">
                  <v-col align="center">
                    <a-select :filter-option="filterOption" v-model="intRowNo" placeholder="Row No" style="width: 60%" @change="(intPageNo = 1), mChangeSearch()">
                      <a-select-option v-for="item in objPagenation" :key="item.No" :value="item.No">
                        <div v-if="item.No != 0">
                          {{ item.No }} rows per page
                        </div>
                        <div v-else>All</div>
                      </a-select-option>
                    </a-select>
                  </v-col>

                  <v-col>
                    <v-btn icon tile :disabled="intPageNo <= 1" @click="(intPageNo = intPageNo - 1), mChangeSearch()">
                      <v-icon>mdi-menu-left</v-icon>
                    </v-btn>

                    {{ intPageNo + ` of ` + cPageCount }}

                    <v-btn icon tile :disabled="intPageNo >= cPageCount" @click="(intPageNo = intPageNo + 1), mChangeSearch()">
                      <v-icon>mdi-menu-right</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
<!-- ==================================================================== -->
<!-- ============================== Legends ============================= -->
<!-- ==================================================================== -->
              <div>
                <v-row id="MyBorder" no-gutters class="pa-2 mt-2" justify="center">
                  <v-col cols="12">
                    <a-avatar class="mr-1" shape="square" size="small" :style="{ backgroundColor: '#7CB342', verticalAlign: 'middle', }"></a-avatar>- Not yet committed in gitlab.
                  </v-col>
                  <v-col cols="12" style="background-color: white">
                    <span style="color: red">RED TEXT</span> - Project name not the same in gitlab name.
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-scroll-y-transition>
      </v-col>
<!-- ******************************************************************************************** -->
<!-- ==================================== Project Details ======================================= -->
<!-- ******************************************************************************************** -->
      <v-col cols="6">
        <v-scroll-y-reverse-transition origin="bottom right">
          <v-card class="mx-2" id="MyCard1" tile v-if="blnMounted">
<!-- ================================================================================== -->
<!-- ============================= Initial Page ======================================= -->
<!-- ================================================================================== -->
            <a-result v-if="cPaginatedData.length == 0" title="No Data Found">
              <template #icon>
                <a-icon type="database" />
              </template>
              <template #subTitle>
                <a-button type="primary" size="small" icon="reload" @click="mChangeRouter()">Reload</a-button>
              </template>
            </a-result>
            <a-result v-else-if="objInfo.length == 0" title="Welcome to System Monitoring.">
              <template #subTitle>
                <v-icon large class="pb-1" color="blue" >mdi-hand-pointing-left</v-icon>
                <strong>{{ ` Click item from Project list to view project information.` }}</strong>
              </template>
              <template #icon>
                <a-icon type="gitlab" />
              </template>
            </a-result>
<!-- ======================================================================================= -->
<!-- ============================ Edit Project Informations ================================ -->
<!-- ======================================================================================= -->
            <template v-else>
              <v-card-title v-if=" blnAdministrator || sObjUserInfo ==  mFindGitlabMemberEmail( objProjectInfo.owner != undefined ? objProjectInfo.owner.id : 1 ) ">
                <v-icon left>mdi-information-variant</v-icon>Project Informations
                <v-spacer></v-spacer>
                <a-tooltip placement="left">
                  <span v-if=" objInfo.Avatar != objProjectInfo.avatar_url && objProjectInfo.length != 0 " slot="title" >Replace with avatar on Gitlab</span>
                  <span v-else slot="title">Project Avatar</span>
                  <a-avatar v-if="objInfo.Avatar != objProjectInfo.avatar_url" shape="square" size="large" :src="objInfo.Avatar" @click="objInfo.Avatar = objProjectInfo.avatar_url">{{ objProjectInfo.name != undefined ? objProjectInfo.name.substring(0, 1).toUpperCase() : "" }}</a-avatar>
                  <a-avatar v-else-if="objProjectInfo.length != 0" shape="square" size="large" :src="objInfo.Avatar">{{ objProjectInfo.name != undefined ? objProjectInfo.name.substring(0, 1).toUpperCase() : "" }}</a-avatar>
                </a-tooltip>
              </v-card-title>

              <v-card-text v-if=" blnAdministrator || sObjUserInfo == mFindGitlabMemberEmail( objProjectInfo.owner != undefined ? objProjectInfo.owner.id : 1 ) ">
                <a-form layout="inline" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
                  <a-form-item v-if="blnAdministrator && intType != 3" labelAlign="left" label="Project Type" style="width: 100%">
                    <v-radio-group hide-details class="mt-0" row v-model="objInfo.Type" mandatory dense>
                      <v-radio :value="1" label="NEW SYSTEM"></v-radio>
                      <v-radio :value="2" label="REMAKE"></v-radio>
                      <v-radio :value="3" label="MAINTENANCE"></v-radio>
                      <v-radio :value="4" label="KSK"></v-radio> <!-- 2021-02-18 -->
                      <v-radio :value="5" label="MAGIC V8"></v-radio> <!-- 2021-02-18 -->
                      <v-radio :value="6" label="iCAD"></v-radio> <!-- 2021-02-23 -->
                    </v-radio-group>
                  </a-form-item>

                  <a-form-item labelAlign="left" label="Expected Release Date" style="width: 100%">
                    <a-date-picker placeholder="Select Expected Release Date" allowClear style="width: 100%" v-model="objInfo.ExpectedReleaseDate"/>
                  </a-form-item>

                  <a-form-item v-if="objInfo.Type == 3" labelAlign="left" label="Released Date" style="width: 100%">
                    <a-date-picker placeholder="Select Released Date" allowClear style="width: 100%" v-model="objInfo.ReleasedDate"/>
                  </a-form-item>

                  <a-form-item v-if="blnAdministrator" labelAlign="left" label="Section Incharge" required style="width: 100%">
                    <a-select v-model="objInfo.SectionID" allowClear placeholder="Select Section Incahge" showSearch :filter-option="filterOption">
                      <a-select-option v-for="i in objSections" :key="i.SectionID" :value="i.SectionID">{{ i.SectionName }}</a-select-option>
                    </a-select>
                  </a-form-item>

                  <a-form-item v-if="blnAdministrator" labelAlign="left" label="Project Name" required style="width: 100%">
                    <a-input allowClear placeholder="Input Project Name" v-model="objInfo.Name"></a-input>
                  </a-form-item>

                  <a-form-item labelAlign="left" label="Project URL" style="width: 100%">
                    <a-input allowClear placeholder="Input Project URL" v-model="objInfo.URL"></a-input>
                  </a-form-item>

                  <a-form-item v-if="blnAdministrator" labelAlign="left" label="Gitlab Project Name" style="width: 100%">
                    <a-select v-model="objInfo.Gitlab_ID" show-search placeholder="Select Gitlab Project" :filter-option="filterOption" allowClear @change="mGetInformation(objInfo.Gitlab_ID)">
                      <a-select-option v-for="i in objProjects" :key="i.id" :value="i.id" >{{ i.name }}</a-select-option>
                    </a-select>
                  </a-form-item>

                  <a-form-item v-if="blnAdministrator && !blnRemove && intType != 7" :wrapper-col="{ span: 24 }" style="width: 100%"> <!-- 2021-02-18 --> <!-- 2021-02-23 -->
                    <v-row no-gutters>
                      <v-col>
                        <a-button block icon="delete" @click="blnRemove = !blnRemove" type="danger" :loading="blnLoading">Disposed</a-button>
                      </v-col>
                    </v-row>
                  </a-form-item>

                  <a-form-item v-if="blnRemove || intType == 7" labelAlign="left" label="Disposed Type" style="width: 100%; margin-bottom: 0px" help="Please select disposed type."> <!-- 2021-02-18 --> <!-- 2021-02-23 -->
                    <v-radio-group hide-details class="mt-0" row v-model="objInfo.DisposedType" dense>
                      <v-radio v-for="item in objM_DisposedTypes" :key="item.DisposedTypesID" :label="item.DisposedTypesName.toUpperCase()" :value="item.DisposedTypesID"></v-radio>
                    </v-radio-group>
                  </a-form-item>

                  <a-form-item :wrapper-col="{ span: 24 }" style="width: 100%">
                    <v-row no-gutters>
                      <v-col>
                        <a-button block icon="save" @click="mUpdateProject(objInfo)" type="primary" :loading="blnLoading" :disabled="cCheckEdit">Save</a-button>
                      </v-col>
                    </v-row>
                  </a-form-item>
                </a-form>
              </v-card-text>

<!-- ================================================================================== -->
<!-- ======================== GitLab Project Informations ============================= -->
<!-- ================================================================================== -->
              <v-card-title>
                <v-icon left>mdi-gitlab</v-icon>Gitlab Project Informations
                <v-spacer></v-spacer>
                <a-tooltip placement="right">
                  <span slot="title">{{ mblnNotif(objInfo.Gitlab_ID) ? "Unsubscribe to stop notifications." : "Subscribe to receive notifications for any activity." }}</span>
                  <a-button v-if="objInfo.Gitlab_ID != null" type="danger" @click="mNotif(mblnNotif(objInfo.Gitlab_ID))">
                    <v-icon style="margin-top: -4px" left small color="white"> {{ mblnNotif(objInfo.Gitlab_ID) ? "mdi-bell-off-outline" : "mdi-bell-outline" }}</v-icon>
                    {{ mblnNotif(objInfo.Gitlab_ID) ? "Unsubscribe" : "Subscribe" }}
                  </a-button>
                </a-tooltip>
              </v-card-title>

              <v-card-text>
                <a-descriptions :column="2" size="small" v-if="objProjectInfo != undefined">
                  <a-descriptions-item label="Gitlab Project ID">
                    {{ objProjectInfo.id }}
                  </a-descriptions-item>

                  <a-descriptions-item label="Gitlab Project Name">
                    <a-tooltip placement="top" title="Double click to open project in GITLAB">
                      <a @dblclick="mOpenURL(objProjectInfo.web_url)" style="text-decoration: underline">{{ objProjectInfo.name }}</a>
                    </a-tooltip>
                  </a-descriptions-item>

                  <a-descriptions-item label="Project Owner" v-if="objProjectInfo.owner != undefined">
                    <a-tooltip placement="top" title="Double click to view project owner's information">
                      <a @dblclick="mOpenURL(objProjectInfo.owner.web_url)" style="text-decoration: underline" >{{ objProjectInfo.owner.name }}</a>
                    </a-tooltip>
                  </a-descriptions-item>

                  <a-descriptions-item label="Project Type">
                    <v-icon v-if="objInfo.Type == 1" left color="red">mdi-new-box</v-icon>
                    <v-icon v-else-if="objInfo.Type == 2" left color="green">mdi-registered-trademark</v-icon>
                    <v-icon v-else-if="objInfo.Type == 4" left color="black">mdi-alpha-k-box</v-icon> <!-- 2021-02-18 -->
                    <v-icon v-else-if="objInfo.Type == 5" left color="orange">mdi-alpha-m-box-outline</v-icon> <!-- 2021-02-18 -->
                    <v-icon v-else-if="objInfo.Type == 6" left color="purple">mdi-alpha-i-circle-outline</v-icon> <!-- 2021-02-23 -->
                    <v-icon v-else left color="black">mdi-tools</v-icon>
                    {{ mGetTypeName(objInfo.Type) }}
                  </a-descriptions-item>

                  <a-descriptions-item label="Expected Release Date">
                    {{ objInfo.ExpectedReleaseDate }}
                    {{ objInfo.ExpectedReleaseDateRange }}
                  </a-descriptions-item>

                  <a-descriptions-item label="Released Date">
                    {{ objInfo.ReleasedDate }}
                    {{ objInfo.ReleasedDateRange }}
                  </a-descriptions-item>

                  <a-descriptions-item label="Created Date">
                    {{ moment(objProjectInfo.created_at).format("YYYY-MM-DD") }}
                    ({{ moment(objProjectInfo.created_at).fromNow() }})
                  </a-descriptions-item>

                  <a-descriptions-item label="Last Activity">
                    {{ moment(objProjectInfo.last_activity_at).format("YYYY-MM-DD") }}
                    ({{ moment(objProjectInfo.last_activity_at).fromNow() }})
                  </a-descriptions-item>

                  <a-descriptions-item label="Description">
                    {{ objProjectInfo.description }}
                  </a-descriptions-item>
                </a-descriptions>
              </v-card-text>
<!-- ================================================================================== -->
<!-- ============================ Project Users ======================================= -->
<!-- ================================================================================== -->
              <v-card-title>
                <v-icon left>mdi-account-group-outline</v-icon>Project Users
                <v-spacer></v-spacer>
                <a-button @click=" (blnEditUser = true), (strAddCompanies = undefined), (strAddDepartments = undefined) " type="primary" icon="edit" v-if=" blnAdministrator || sObjUserInfo == mFindGitlabMemberEmail( objProjectInfo.owner != undefined ? objProjectInfo.owner.id : 1 ) ">Edit Users</a-button>
              </v-card-title>

              <v-card-text>
                <a-list size="small" item-layout="horizontal" :data-source="objInfo.ProjectUser" bordered>
                  <a-list-item slot="renderItem" slot-scope="item">
                    <a-list-item-meta>
                      <span slot="title">
                        Company Name :
                        <span class="black--text">
                          {{ item.CompanyName }}
                        </span>
                      </span>

                      <span slot="description">
                        <span style="color: #595959">
                          {{ `Department Name : ` }}
                        </span>
                        <span class="black--text">
                          {{ item.DepartmentName }}
                        </span>
                      </span>
                    </a-list-item-meta>
                  </a-list-item>
                </a-list>
              </v-card-text>
<!-- ================================================================================== -->
<!-- =========================== Project Members ====================================== -->
<!-- ================================================================================== -->
              <v-card-title>
                <v-icon left>mdi-account-multiple-outline</v-icon>
                Project Members
              </v-card-title>

              <v-card-text>
                <a-list size="small" item-layout="horizontal" :data-source="objProjectMembers" bordered>
                  <a-list-item slot="renderItem" slot-scope="item">
                    <a-list-item-meta>
                      <a-avatar slot="avatar" size="small" shape="square" :src="item.avatar_url">{{ item.name.substring(0, 1).toUpperCase() }}</a-avatar>

                      <span slot="title">
                        <a-tooltip placement="top" title="Double click to open member's information">
                          <a @dblclick="mOpenURL(item.web_url)" style="text-decoration: underline">{{ item.name }}</a>
                        </a-tooltip>
                        ({{ item.username }})
                      </span>
                    </a-list-item-meta>

                    <a-badge slot="extra" :status="item.state == 'active' ? 'processing' : 'error'" :text="item.state"/>
                  </a-list-item>
                </a-list>
              </v-card-text>

<!-- ================================================================================== -->
<!-- =========================== Project Issues ======================================= -->
<!-- ================================================================================== -->
              <v-card-title>
                <v-icon left>mdi-bulletin-board</v-icon>
                Project Issues
                <v-spacer></v-spacer>
                <a-button v-if="objInfo.Gitlab_ID != null || objInfo.Gitlab_ID != undefined" @click="OpenMilestones(objInfo.Gitlab_ID)" type="primary" icon="dot-chart">Milestones</a-button>
              </v-card-title>

              <v-card-text>
                <a-tabs default-active-key="1" size="small">
                  <a-tab-pane v-for="a in 3" :key="a">
                    <span slot="tab">{{ a == 1 ? "All" : a == 2 ? "Open" : "Closed" }} ({{ a == 1 ? objProjectIssues.length : mFilterIssues(a == 2 ? "opened" : "closed").length }})</span>
                    <a-list size="small" item-layout="horizontal" :data-source=" a == 1 ? objProjectIssues : mFilterIssues(a == 2 ? 'opened' : 'closed') " bordered :pagination="{ pageSize: 5, showLessItems: true }">
                      <a-list-item slot="renderItem" slot-scope="item">
                        <a-list-item-meta>
                          <span slot="description">
                            #{{ item.iid }} ·Opened
                            <a-tooltip placement="top" :title="moment(item.created_at).format('LLL')">
                              {{ moment(item.created_at).fromNow() }}
                            </a-tooltip>
                            {{ "by" }}
                            <a-tooltip placement="top" title="Double click to open member's information">
                              <a @dblclick="mOpenURL(item.author.web_url)" style="text-decoration: underline">{{ item.author.name }}</a>
                            </a-tooltip>

                            <p class="ma-0 text-left">
                              Due date :
                              <a-tooltip placement="top" title="Due Date">
                                {{ item.due_date }}
                              </a-tooltip>
                            </p>
                          </span>

                          <span slot="title">
                            <a-tooltip placement="top" title="Double click to open project issue">
                              <a style="text-decoration: underline" @dblclick="mOpenURL(item.web_url)">{{ item.title }}</a>
                            </a-tooltip>
                          </span>
                        </a-list-item-meta>

                        <div slot="extra">
                          <p class="ma-0 text-right">
                            {{ item.state.toUpperCase() }}
                          </p>
                          <p class="ma-0 text-right">
                            Updated
                            <a-tooltip placement="left" :title="moment(item.updated_at).format('LLL')">
                              {{ moment(item.updated_at).fromNow() }}
                            </a-tooltip>
                          </p>
                        </div>
                      </a-list-item>
                    </a-list>
                  </a-tab-pane>
                </a-tabs>
              </v-card-text>
<!-- ================================================================================== -->
<!-- =========================== Project Commits ====================================== -->
<!-- ================================================================================== -->
              <v-card-title>
                <v-icon left>mdi-source-commit</v-icon>Project Commits
                <v-spacer></v-spacer>
                <v-select v-if="objProjectBranches.length > 1" :items="objProjectBranches" v-model="strFilterBranches" item-text="name" item-value="name" solo dense hide-details @change="mGetProjectCommits(objInfo.Gitlab_ID)"></v-select>
                <v-spacer></v-spacer>
              </v-card-title>

              <v-card-text>
                <a-list size="small" item-layout="horizontal" :data-source=" objProjectInfo.empty_repo == false ? objProjectCommits : [] " bordered :pagination="{ pageSize: 5, showLessItems: true }">
                  <a-list-item slot="renderItem" slot-scope="item">
                    <a-list-item-meta>
                      <a-avatar slot="avatar" size="large" class="mt-1" :src="mFindMemberAvatar(item.author_email)" shape="square">
                        {{ item.author_name.substring(0, 1).toUpperCase() }}
                      </a-avatar>

                      <span slot="title">
                        {{ item.title }}
                      </span>

                      <span slot="description">
                        <a-tooltip placement="top" :title="`Double click to open member's information`">
                          <a @dblclick=" mOpenURL(mFindMemberUrl(item.author_email)) " style="text-decoration: underline">{{ mFindMemberName( item.author_email, item.author_name ) }}</a>
                        </a-tooltip>
                        {{ "authored" }}
                        <a-tooltip placement="top" :title="moment(item.created_at).format('LLL')">
                          {{ moment(item.created_at).fromNow() }}
                        </a-tooltip>
                      </span>
                    </a-list-item-meta>

                    <span slot="extra">
                      {{ moment(item.created_at).format("LL") }}
                    </span>
                  </a-list-item>
                </a-list>
              </v-card-text>
            </template>
          </v-card>
        </v-scroll-y-reverse-transition>
      </v-col>
    </v-row>
<!-- ******************************************************************************************** -->
<!-- ===================================== Add New Project ====================================== -->
<!-- ******************************************************************************************** -->
    <a-modal v-model="blnAddNew" title="New Project" :maskClosable="false">
      <template slot="footer">
        <a-button key="back" @click="blnAddNew = false">Cancel</a-button>
        <a-button :disabled="cCheckNew" key="submit" icon="save" type="primary" :loading="blnLoading" @click="mSaveProject(objInfoNew)" >Save</a-button>
      </template>

      <a-form layout="inline" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
        <a-form-item labelAlign="left" label="Project Type" style="width: 100%">
          <v-radio-group hide-details style="margin-top: 0" row v-model="objInfoNew.Type" mandatory dense>
            <v-radio :value="1" label="NEW SYSTEM"></v-radio>
            <v-radio :value="2" label="REMAKE"></v-radio>
            <v-radio :value="3" label="MAINTENANCE"></v-radio>
            <v-radio :value="4" label="KSK"></v-radio> <!-- 2021-02-18 -->
            <v-radio :value="5" label="MAGIC V8"></v-radio> <!-- 2021-02-18 -->
            <v-radio :value="6" label="iCAD"></v-radio> <!-- 2021-02-23 -->
          </v-radio-group>
        </a-form-item>
 
        <a-form-item labelAlign="left" label="Expected Release Date" style="width: 100%">
          <a-date-picker placeholder="Select Expected Release Date" allowClear style="width: 100%" v-model="objInfoNew.ExpectedReleaseDate"/>
        </a-form-item>
 
        <a-form-item v-if="objInfoNew.Type == 3" labelAlign="left" label="Released Date" style="width: 100%">
          <a-date-picker placeholder="Select Released Date" allowClear style="width: 100%" v-model="objInfoNew.ReleasedDate"/>
        </a-form-item>

        <a-form-item labelAlign="left" label="Section Incharge" required style="width: 100%">
          <a-select v-model="objInfoNew.SectionID" allowClear showSearch placeholder="Select Section Incharge" :filter-option="filterOption">
            <a-select-option v-for="i in objSections" :key="i.SectionID" :value="i.SectionID" >
              {{ i.SectionName }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item labelAlign="left" label="Project Name" required style="width: 100%">
          <a-input allowClear placeholder="Input Project Name" v-model="objInfoNew.Name"></a-input>
        </a-form-item>

        <a-form-item labelAlign="left" label="Project URL" style="width: 100%">
          <a-input allowClear placeholder="Input Project URL" v-model="objInfoNew.URL"></a-input>
        </a-form-item>

        <a-form-item labelAlign="left" label="Gitlab Project" style="width: 100%">
          <a-select placeholder="Select Gitlab Project" v-model="objInfoNew.Gitlab_ID" show-search :filter-option="filterOption" allowClear>
            <a-select-option
              v-for="i in objProjects" :key="i.id" :value="i.id" >{{ i.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
<!-- ******************************************************************************************** -->
<!-- ========================================= Edit Users ======================================= -->
<!-- ******************************************************************************************** -->
    <a-modal v-model="blnEditUser" title="Project Users" :maskClosable="false">
      <template slot="footer">
        <a-button key="back" @click="(blnEditUser = false), mClickProject(objInfo)">
          Close
        </a-button>
        <a-button key="submit" icon="save" type="primary" :loading="blnLoading" @click="mUpdateProject(objInfo)">
          Save
        </a-button>
      </template>

      <v-row justify="space-around">
        <v-col cols="6" style="padding-top: 0px">
          <a-select showSearch allowClear :filter-option="filterOption" v-model="strAddCompanies" placeholder="Select Company" @change="strAddDepartments = undefined" style="width: 100%">
            <a-select-option value="All Company">All Company</a-select-option>
            <a-select-option v-for="item in objCompanies" :key="item.CompanyName" :value="item.CompanyName">
              {{ item.CompanyName }}
            </a-select-option>
          </a-select>
        </v-col>

        <v-col cols="6" style="padding-top: 0px">
          <a-select showSearch allowClear :filter-option="filterOption" v-model="strAddDepartments" placeholder="Select Department" style="width: 100%">
            <a-select-option value="All Department">
              All Department
            </a-select-option>

            <!-- v-for="item in filteredDepartmentsAdd" -->
            <a-select-option v-for="item in strAddCompanies != 'All Company' && strAddCompanies != undefined ? filteredDepartmentsAdd : objDepartmentsDistinct" :key="item.DepartmentName" :value="item.DepartmentName">
              {{ item.DepartmentName }}
            </a-select-option>
          </a-select>
        </v-col>

        <v-col cols="12" style="padding-top: 0px">
          <a-button icon="plus" :disabled="cCheckAddProjectUser" block type="primary" @click="mAddProjectUser()">
            Add User
          </a-button>
        </v-col>
      </v-row>

      <a-list size="small" item-layout="horizontal" :data-source="objInfo.ProjectUser" bordered :pagination="{ pageSize: 5, showLessItems: true }">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-list-item-meta>
            <span slot="title">
              Company Name :
              <span class="black--text">
                {{ item.CompanyName }}
              </span>
            </span>
            <span slot="description">
              Department Name :
              <span class="black--text">
                {{ item.DepartmentName }}
              </span>
            </span>
          </a-list-item-meta>

          <div slot="extra">
            <a-popconfirm title="Remove project user?" ok-text="Yes" cancel-text="No" @confirm="mRemoveProjectUser(item)">
              <a-icon type="delete" theme="twoTone" two-tone-color="red" />
            </a-popconfirm>
          </div>
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
        blnURLFound: false,
        blnFirstLoad: true,
        blnMounted: false,
        blnAddNew: false,
        blnEditUser: false,
        blnLoading: false,
        blnRemove: false,
        blnAsc: false,

        intType: 0,
        intPageNo: 1,
        intRowNo: 10,

        ToDate: new Date(),
        strFilterBranches: "",
        strSearch: undefined,
        strFilterCompanies: undefined,
        strFilterDepartments: undefined,
        strFilterSections: undefined,
        strFilterProjectOwner: undefined,
        strAddCompanies: undefined,
        strAddDepartments: undefined,
        strNoDataImage: Empty.PRESENTED_IMAGE_SIMPLE,
        
        objInfo: {},
        objInfoNew: {},

        objM_DisposedTypes: [],
        objCompanies: [],
        objDepartments: [],
        objDepartmentsDistinct: [],
        objSections: [],
        objUsers: [],
        objProjects: [],
        objProjectInfo: [],
        objProjectUsers: [],
        objProjectIssues: [],
        objProjectMembers: [],
        objProjectBranches: [],
        objProjectCommits: [],
        objProjectOwner: [],
        objGitlab_Projects: [],
        objProjectsIssuesStatistics: [],
        objAllProjectsIssuesStatistics: [],
        objPagenation: [ { No: 0 }, { No: 10 }, { No: 20 }, { No: 30 }, { No: 40 }, { No: 50 }, ],
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
      if (this.blnFirstLoad == true && this.objInfo.Name != undefined) {
        let el = this.mChangeSpace(this.objInfo.Name)
        this.$scrollTo(`#${el}`, {
          container: "#MyDiv2",
        })
        this.blnFirstLoad = false
      }
    },
// ********************************************************************************** //
// ===================================== Created ==================================== //
// ********************************************************************************** //
    created(){
      this.strSearch = this.$route.query.search
      this.mGetProjects()
      this.mGetGitlab_Projects()
      setInterval(this.mGetDateNow, 1000)
      this.mGetUsers()
      this.mGetCompanies()
      this.mGetDepartments()
      this.mGetDepartmentsDistinct()
      this.mGetSections()
      this.mGetProjectOwner()
      this.mGetM_DisposedTypes()
    },
// *********************************************************************************** //
// ===================================== Computed ==================================== //
// *********************************************************************************** //
    computed:{
      filteredSearch(){
        let data = this.objGitlab_Projects
        if(this.strSearch != undefined){
          data = data.filter(rec => {
            return rec.Name.toUpperCase().includes(this.strSearch.toUpperCase())
          })
        }
        if(this.strFilterCompanies != undefined){
          data = data.filter(rec => {
            return(rec.ProjectUser.filter(recs => {
              return(recs.CompanyName == this.strFilterCompanies || recs.CompanyName == "All Company")
            }).length != 0)
          })
        }
        if(this.strFilterDepartments != undefined){
          data = data.filter(rec => {
            return(rec.ProjectUser.filter(recs => {
              return(recs.DepartmentName == this.strFilterDepartments || recs.DepartmentName == "All Department")
            }).length != 0)
          })
        }
        if(this.strFilterProjectOwner != undefined){
          data = data.filter(rec => {
            return rec.ProjectOwner == this.strFilterProjectOwner
          })
        }
        if(this.strFilterSections != undefined){
          data = data.filter(rec => {
            return rec.SectionID == this.strFilterSections
          })
        }
        if(this.intType == 7){ // 2021-02-18 // 2021-02-23
          data = data.filter(rec => {
            return rec.DisposedType != 0
          })
        }
        else if(this.intType != 0 && this.intType != undefined){
          data = data.filter(rec => {
            return rec.Type == this.intType && rec.DisposedType == 0
          })
        }
        else{
          data = data.filter(rec => {
            return((rec.Type != 3 || rec.Type != 7) && rec.DisposedType == 0) // 2021-02-18 // 2021-02-23
          })
        }
        return data
      },
      cPageCount(){
        let l = this.filteredSearch.length
        let s = this.intRowNo != 0 ? this.intRowNo : this.filteredSearch.length
        return Math.ceil(l / s)
      },
      cPaginatedData(){
        let s = this.intRowNo != 0 ? this.intRowNo : this.filteredSearch.length
        const start = (this.intPageNo - 1) * s
        const end = start + s
        return this.filteredSearch.slice(start, end)
      },
      filteredDepartments(){
        let data = []
        if(this.objInfo.CompanyCode != "" && this.objInfo.CompanyCode != undefined){
          data = this.objDepartments
          data = data.filter(rec => {
            return rec.CompanyCode == this.objInfo.CompanyCode
          })
        }
        return data
      },
      filteredDepartmentsU(){
        let data = []
        if(this.strFilterCompanies != "" && this.strFilterCompanies != undefined){
          data = this.objDepartments
          data = data.filter(rec => {
            return rec.CompanyName == this.strFilterCompanies
          })
          data = Array.from(new Set(data.map(s => s.DepartmentName))).map(name => {
              return{DepartmentName: data.find(s => s.DepartmentName === name).DepartmentName}
          })
        }
        return data
      },
      filteredDepartmentsAdd(){
        let data = []
        if(this.strAddCompanies != "" && this.strAddCompanies != undefined){
          data = this.objDepartments
          data = data.filter(rec => {
            return rec.CompanyName == this.strAddCompanies
          })
          data = Array.from(new Set(data.map(s => s.DepartmentName))).map(name => {
            return{DepartmentName: data.find(s => s.DepartmentName === name).DepartmentName}
          })
        }
        return data
      },
      cCheckEdit(){
        let val = false
        if(this.objInfo.SectionID == undefined && this.objInfo.Type != 7){ // 2021-02-18 // 2021-02-23
          val = true
        }
        if(this.objInfo.Name == "" || this.objInfo.Name == undefined){
          val = true
        }
        return val
      },
      cCheckNew(){
        let val = false
        if(this.objInfoNew.SectionID == undefined && this.objInfoNew.Type != 7){  // 2021-02-18 // 2021-02-23
          val = true
        }
        if(this.objInfoNew.Name == "" || this.objInfoNew.Name == undefined){
          val = true
        }
        return val
      },
      cCheckAddProjectUser(){
        let val = false
        if(this.strAddCompanies == undefined || this.strAddDepartments == undefined){
          val = true
        }
        return val
      },
    },
// ******************************************************************************* //
// =================================== Methods =================================== //
// ******************************************************************************* //
    methods: {
      moment,
      OpenMilestones(ID){
        const PageAPI = `${this.$store.state.gitlab_api}/api/v4/projects/${ID}?private_token=mxus9a5iYWGjkw_TqTsD`
          axios.get(PageAPI).then(Page => {
            let PageURL = Page.data.web_url
            window.open(PageURL + "/-/milestones", "_blank")
          })
      },
      mChangeSpace(el){
        let data = el
        data = data.replace("(", "")
        data = data.replace(")", "")
        data = data.replace(".", "")
        data = data.replace(/,/gi, "")
        data = data.replace(/ /gi, "")
        return data
      },
      mProjectLength(id){
        let data = this.objGitlab_Projects
        if(this.strSearch != undefined){
          data = data.filter(rec => {
            return rec.Name.toUpperCase().includes(this.strSearch.toUpperCase())
          })
        }
        if(this.strFilterCompanies != undefined){
          data = data.filter(rec => {
            return(rec.ProjectUser.filter(recs => {
              return(recs.CompanyName == this.strFilterCompanies || recs.CompanyName == "All Company")
            }).length != 0)
          })
        }
        if(this.strFilterDepartments != undefined){
          data = data.filter(rec => {
            return(rec.ProjectUser.filter(recs => {
              return(recs.DepartmentName == this.strFilterDepartments || recs.DepartmentName == "All Department")
            }).length != 0)
          })
        }
        if(this.strFilterProjectOwner != undefined){
          data = data.filter(rec => {
            return rec.ProjectOwner == this.strFilterProjectOwner
          })
        }
        if(this.strFilterSections != undefined){
          data = data.filter(rec => {
            return rec.SectionID == this.strFilterSections
          })
        }
        if(id == 7){ // 2021-02-18 // 2021-02-23
          data = data.filter(rec => {
            return rec.DisposedType != 0
          })
        }
        else if(id != 0 && id != undefined){
          data = data.filter(rec => {
            return rec.Type == id && rec.DisposedType == 0
          })
        }
        else{
          data = data.filter(rec => {
            return((rec.Type != 3 && rec.Type != 7) && rec.DisposedType == 0) // 2021-02-18 // 2021-02-23
          })
        }
        return data.length
      },
      mNotif(blnVAl){
        let url = `${this.api}/NotificationDataInsertUpdate`
        let Data = {
          Gitlab_ID: this.objInfo.Gitlab_ID,
          NotifDate: this.dtDateNow,
          DeletedDate: blnVAl ? this.dtDateNow : null,
          UpdatedDate: this.dtDateNow,
          UpdatedByUserID: this.csintUserID,
        }
        axios.post(url,Data).then(res => {
          this.$notification.info({
            message: "Gitlab Monitoring", icon: blnVAl ? 
              ( <v-icon>mdi-bell-off-outline</v-icon> ) : ( <v-icon>mdi-bell-outline</v-icon> ),
            description: `${ blnVAl ? 
              "Unsubscibe" : "Subscibe"} ${this.mFindGitlabName(res.data.Gitlab_ID)} successfully.`
          })
        })
        .catch(err => {
          console.log(err)
          console.log(url)
        })
        .finally(() => {
          this.smGetNotificationData()
        })
      },
      mblnNotif(id){
        let data = this.sObjNotificationData.find(res => {
          return res.Gitlab_ID == id
        })
        return data != undefined
      },
      mChangeRouter(){
        this.$router.push("/Project")
        location.reload()
      },
      mChangeSearch(){
        if(this.strSearch == ""){
          this.strSearch = undefined
        }
        if(this.cPaginatedData.length != 0){
          let qparamsName = this.$route.query.name
          if(qparamsName != undefined && qparamsName != "" && qparamsName != null){
            this.mClickProject(this.cPaginatedData[0])
          }
          else{
            this.objInfo = []
          }
          this.mGetProjectIssuesStatistics(this.cPaginatedData)
        }
        else{
          this.objInfo = []
        }
      },
      mChangeSearchParams(qparams){
        let data = this.objGitlab_Projects.filter(rec => {
          return this.mChangeSpace(rec.Name).toUpperCase().includes(qparams.toUpperCase())
        })
        if(this.blnAdministrator == false){
          data = data.filter(rec => {
            return rec.DisposedType == 0
          })
        }
        if(data.length != 0){
          this.intType = data[0].Type
          if(data[0].DisposedType != 0){
            this.intType = 6
          }
          this.mClickProject(data[0])
          this.intPageNo = this.mGetPageParams(qparams)
          this.mGetProjectIssuesStatistics(this.cPaginatedData)
        }
        else{
          this.blnURLFound = true
        }
      },
      mOpenURL(href){
        window.open(href, "_blank")
      },
      filterOption(input,option){
        return(option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
      },
      mGetDateNow(){
        this.ToDate = new Date()
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
      mGetCompanies(){
        let url = `${this.api}/Companies`
        axios.get(url).then(res => {
            this.objCompanies = res.data
        })
        .catch(err => {
          console.log(err)
          console.log(url)
        })
      },
      mGetDepartments(){
        let url = `${this.api}/Departments`
        axios.get(url).then(res => {
          this.objDepartments = res.data
        })
        .catch(err => {
          console.log(err)
          console.log(url)
        })
      },
      mGetDepartmentsDistinct(){
        let url = `${this.api}/DepartmentsDistinct`
        axios.get(url).then(res => {
          this.objDepartmentsDistinct = res.data
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
      mGetPageParams(qparams){
        let no = 1
        for(let a = 0; a < this.filteredSearch.length; a++){
          const data = this.filteredSearch[a]
          if(this.mChangeSpace(data.Name).toUpperCase().includes(qparams.toUpperCase())){
            no = a + 1
          }
        }
        let s = this.intRowNo != 0 ? this.intRowNo : no
        return Math.ceil(no / s)
      },
      mGetProjectsPercentage(id){
        let objData = this.objProjectsIssuesStatistics.find(rec => {
          return rec.Gitlab_ID == id
        })
        let toReturn = 0
        if(objData != undefined){
          toReturn = objData.Percentage
        }
        return toReturn
      },
      mGetProjectOwner(){
        let url = `${this.api}/Gitlab_Projects_ProjectOwner`
        axios.get(url).then(res => {
          this.objProjectOwner = res.data
        })
        .catch(err => {
          console.log(err)
          console.log(url)
        })
      },
      mGetCompanyName(id){
        let data = this.objCompanies.find(rec => {
          return rec.CompanyCode == id
        })
        if(data != undefined){
          return data.CompanyName
        }
        else{
          return ""
        }
      },
      mGetDepartmentName(val){
        let data = this.objDepartments.find(rec => {
          return(rec.CompanyCode == val.CompanyCode && rec.DepartmentCode == val.DepartmentCode)
        })
        if(data != undefined){
          return data.DepartmentName
        }
        else{
          return ""
        }
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
      mGetTypeName(Type){
        if(Type == 1){
          return "NEW SYSTEM"
        }
        else if(Type == 2){
          return "REMAKE SYSTEM"
        }
        else if(Type == 4){
          return "KSK" // 2021-02-18
        }
        else if(Type == 5){
          return "MAGIC V8" // 2021-02-18
        }
        else if(Type == 6){
          return "iCAD" // 2021-02-23
        }
        else{
          return "MAINTENANCE"
        }
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
      mFindGitlabName(id){
        let find = this.objProjects.find(rec => {
          return rec.id == id
        })
        if(find != undefined){
          return find.name
        }
        else{
          return ""
        }
      },
      mFindGitlabMemberEmail(id){
        let find = this.objUsers.find(rec => {
          return rec.ID == id
        })
        if(find != undefined){
          return find.Email
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
      mGetInformation(id){
        if(id != null && id != "" && id != undefined){
          this.mGetGitlabProjectInfo(id)
          this.mGetProjectIssues(id)
          this.mGetProjectUsers(id)
          this.mGetProjectMembers(id)
          this.mGetProjectBranches(id)
        }
      },
      mClickProject(data){
        // console.log(data)
        // this.objInfo = data
        this.blnRemove = false
        this.objProjectInfo = []
        this.objProjectUsers = []
        this.objProjectIssues = []
        this.objProjectMembers = []
        this.objProjectBranches = []
        this.objProjectCommits = []
        this.mGetProjectInfo(data.ID)
        if(data.Gitlab_ID != null){
          this.mGetInformation(data.Gitlab_ID)
        }
        let query = {}
        if(this.strSearch != undefined){
          query = {name: this.mChangeSpace(data.Name), search: this.strSearch}
        }
        else{
          query = {name: this.mChangeSpace(data.Name)}
        }
        if(this.$router.app._route.query.name != query.name || this.$router.app._route.query.search != query.search){
          this.$router.push({
            path: "/Project",
            query: query,
          })
        }
      },
      mFilterIssues(filter){
        let data = this.objProjectIssues.filter(rec => {
          return rec.state == filter
        })
        return data
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
      mGetM_DisposedTypes(){
        let url = `${this.api}/M_DisposedTypes`
        axios.get(url).then(res => {
          this.objM_DisposedTypes = res.data
        })
        .catch((err) => {
          console.log(err)
          console.log(url)
        })
      },
      mGetGitlab_Projects(){
        let url = `${this.api}/Gitlab_Projects`
        axios.get(url).then(res => {
          let theData = res.data
          theData.map(rec => {
            rec.ProjectUser = rec.ProjectUser == "" ? [] : JSON.parse(rec.ProjectUser)
            return rec
          })
          this.objGitlab_Projects = theData
          let qparamsName = this.$route.query.name
          if(qparamsName != undefined && qparamsName != "" && qparamsName != null){
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
      mAddProjectUser(){
        let data = {CompanyName: this.strAddCompanies, DepartmentName: this.strAddDepartments}
        this.objInfo.ProjectUser.push(data)
        this.strAddCompanies = undefined
        this.strAddDepartments = undefined
      },
      mRemoveProjectUser(data){
        this.objInfo.ProjectUser.splice(this.objInfo.ProjectUser.indexOf(data),1)
      },
      mUpdateProject(data){
        this.blnLoading = true
        if(data.Gitlab_ID == undefined){
          data.Gitlab_ID = null
        }
        else{
          data.Avatar = this.objProjectInfo.avatar_url
          if(this.objProjectInfo.owner != undefined){
            data.ProjectOwner = this.objProjectInfo.owner.name
          }
        }
        if(data.URL == undefined || data.URL == ""){
          data.URL = null
        }
        if(data.Type == 7 && (data.SectionID == undefined || data.SectionID == null)){ // 2021-02-18 // 2021-02-23
          data.SectionID = null
        }
        if(data.ExpectedReleaseDate == null || data.ExpectedReleaseDate == undefined || data.ExpectedReleaseDate == ""){
          data.ExpectedReleaseDate = null
        }
        else{
          data.ExpectedReleaseDate = moment(data.ExpectedReleaseDate).format("YYYY/MM/DD HH:mm:ss")
        }
        if(data.ReleasedDate == null || data.ReleasedDate == undefined || data.ReleasedDate == ""){
          data.ReleasedDate = null
        }
        else{
          data.ReleasedDate = moment(data.ReleasedDate).format("YYYY/MM/DD HH:mm:ss")
        }
        if(JSON.stringify(data.ProjectUser) != ""){
          data.ProjectUser = JSON.stringify(data.ProjectUser)
        }
        else{
          data.ProjectUser = ""
        }
        data.UpdatedDate = this.dtDateNow
        data.UpdatedByUserID = this.intAdministratorID
        let url = `${this.api}/Gitlab_ProjectsUpdate`
        axios.post(url, data).then(res => {
          console.log(res.data)
          this.$notification.success({ message: "Project Maintenance", description: "Successfully update project.", })
        })
        .catch(err => {
          console.log(err)
          console.log(url)
        })
        .finally(() => {
          data.ProjectUser = JSON.parse(data.ProjectUser)
          this.mClickProject(data)
          this.blnLoading = false
          this.blnEditUser = false
          this.mGetProjectIssuesStatistics(this.cPaginatedData)
          this.mGetGitlab_Projects()
        })
      },
      mAddnew(){
        this.objInfoNew = {}
        this.blnAddNew = true
      },
      mSaveProject(data){
        this.blnLoading = true
        if(data.Gitlab_ID == undefined){
          data.Gitlab_ID = null
        }
        if(data.URL == undefined || data.URL == ""){
          data.URL = null
        }
        if(data.ExpectedReleaseDate == null || data.ExpectedReleaseDate == undefined || data.ExpectedReleaseDate == ""){
          data.ExpectedReleaseDate = null
        }
        else{
          data.ExpectedReleaseDate = moment(data.ExpectedReleaseDate).format("YYYY/MM/DD HH:mm:ss")
        }
        if(data.ReleasedDate == null || data.ReleasedDate == undefined || data.ReleasedDate == ""){
          data.ReleasedDate = null
        }
        else{
          data.ReleasedDate = moment(data.ReleasedDate).format("YYYY/MM/DD HH:mm:ss")
        }
        data.Avatar = null
        data.ProjectOwner = null
        data.ProjectUser = ""
        data.DisposedType = 0
        data.UpdatedDate = this.dtDateNow
        data.UpdatedByUserID = this.intAdministratorID
        let url = `${this.api}/Gitlab_ProjectsInsert`
        axios.post(url, data).then(res => {
          console.log(res.data)
          // console.log(data)
          this.$notification.success({ message: "Project Maintenance", description: "Successfully add project." })
        })
        .catch(err => {
          console.log(err)
          console.log(url)
        })
        .finally(() => {
          this.mGetGitlab_Projects()
          this.blnLoading = false
          this.blnAddNew = false
        })
      },
      mGetProjectInfo(id){
        if(id != null && id != "" && id != undefined){
          let url = `${this.api}/Gitlab_ProjectsID/${id}`
          axios.get(url).then(res => {
            let theData = res.data
            theData.map(rec => {
              rec.ExpectedReleaseDateRange = rec.ExpectedReleaseDate == null ? "" : " (" + moment(rec.ExpectedReleaseDate).utc().fromNow() + ")"
              rec.ExpectedReleaseDate = rec.ExpectedReleaseDate == null ? "" : moment(rec.ExpectedReleaseDate).utc().format("YYYY-MM-DD")
              rec.ReleasedDateRange = rec.ReleasedDate == null ? "" : " (" + moment(rec.ReleasedDate).utc().fromNow() + ")"
              rec.ReleasedDate = rec.ReleasedDate == null ? "" : moment(rec.ReleasedDate).utc().format("YYYY-MM-DD")
              rec.ProjectUser = rec.ProjectUser == "" ?
                [] : JSON.parse(rec.ProjectUser)
              return rec
            })
            this.objInfo = theData[0]
          })
          .catch(err => {
            console.log(err)
            console.log(url)
          })
        }
      },
      mGetGitlabProjectInfo(id){
        if(id != null && id != "" && id != undefined){
          let url = `${this.$store.state.gitlab_api}/api/v4/projects/${id}?private_token=mxus9a5iYWGjkw_TqTsD&page=1&per_page=100`
          axios.get(url).then(res => {
            this.objProjectInfo = res.data
          })
          .catch(err => {
            console.log(err)
            console.log(url)
          })
        }
      },
      mGetProjectIssues(id){
        this.objProjectIssues = []
        let url = `${this.$store.state.gitlab_api}/api/v4/projects/${id}/issues?private_token=mxus9a5iYWGjkw_TqTsD&page=1&per_page=100`
        axios.get(url).then(res => {
          this.objProjectIssues = res.data
          let data = res.data
          if(data.length != 0){
            data.map(rec => {
              rec.due_date = rec.due_date == null ?
                "" : moment(rec.due_date).format("LL")
              return rec
            })
          }
        })
        .catch(err => {
          console.log(err)
          console.log(url)
        })
      },
      mGetProjectUsers(id){
        if(id != null && id != "" && id != undefined){
          let url = `${this.$store.state.gitlab_api}/api/v4/projects/${id}/users?private_token=mxus9a5iYWGjkw_TqTsD`
          axios.get(url).then(res => {
            this.objProjectUsers = res.data
          })
          .catch(err => {
            console.log(err)
            console.log(url)
          })
        }
      },
      mGetProjectMembers(id){
        if(id != null && id != "" && id != undefined){
          let url = `${this.$store.state.gitlab_api}/api/v4/projects/${id}/members?private_token=mxus9a5iYWGjkw_TqTsD`
          axios.get(url).then(res => {
            this.objProjectMembers = res.data
          })
          .catch(err => {
            console.log(err)
            console.log(url)
          })
        }
      },
      mGetProjectBranches(id){
        if(id != null && id != "" && id != undefined){
          let url = `${this.$store.state.gitlab_api}/api/v4/projects/${id}/repository/branches?private_token=mxus9a5iYWGjkw_TqTsD`
          axios.get(url).then(res => {
            this.objProjectBranches = res.data
            if(this.objProjectBranches.length != 0){
              this.strFilterBranches = res.data[0].name
              this.mGetProjectCommits(id)
            }
          })
          .catch(err => {
            console.log(err)
            console.log(url)
          })
        }
      },
      mGetProjectCommits(id){
        let me = this
        this.objProjectCommits = []
        async function getall(){
          for(let a = 1; a < 10; a++){
            let url = `${me.$store.state.gitlab_api}/api/v4/projects/${id}/repository/commits?private_token=mxus9a5iYWGjkw_TqTsD&page=${a}&per_page=100&ref_name=${me.strFilterBranches}`
            await axios.get(url).then(res => {
              me.mGetAllProjectCommits(res.data)
              if(res.data.length < 100){
                a = 10
              }
            })
            .catch(err => {
              console.log(err)
              console.log(url)
            })
          }
        }
        getall()
      },
      mGetProjects(){
        this.objProjects = []
        this.objProjectsIssuesStatistics = []
        const me = this
        async function getall(){
          for(let a = 1; a < 100; a++){
            let url = `${me.$store.state.gitlab_api}/api/v4/projects?private_token=mxus9a5iYWGjkw_TqTsD&active=true&page=${a}&per_page=100&simple=true&order_by=name&sort=asc`
            await axios.get(url).then(res => {
              me.mGetAllProjects(res.data)
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
        getall()
      },
      mGetProjectIssuesStatistics(data){
        const me = this
        this.objProjectsIssuesStatistics = []
        async function getall(){
          for(let a = 0; a < data.length; a++){
            let id = data[a].Gitlab_ID
            if(id != null && id != "" && id != undefined){
              let url = `${me.$store.state.gitlab_api}/api/v4/projects/${id}/issues_statistics?private_token=mxus9a5iYWGjkw_TqTsD`
              await axios.get(url).then(res => {
                let value = res.data
                value.Gitlab_ID = id
                let toReturn = 0
                let all = value.statistics.counts.all
                let closed = value.statistics.counts.closed
                if (all != 0) {
                  toReturn = Math.ceil((closed / all) * 100)
                }
                value.Percentage = toReturn
                me.mGetAllProjectIssuesStatistics(value)
              })
              .catch(err => {
                console.log(err)
                console.log(url)
              })
            }
          }
        }
        getall()
      },
      mGetAllProjectPercentage(){
        let data = this.objGitlab_Projects
        let me = this
        this.blnLoading = true
        this.objAllProjectsIssuesStatistics = []
        async function getall(){
          for(let a = 0; a < data.length; a++){
            let id = data[a].Gitlab_ID
            if(id != null && id != "" && id != undefined){
              let url = `${me.$store.state.gitlab_api}/api/v4/projects/${id}/issues_statistics?private_token=mxus9a5iYWGjkw_TqTsD`
              await axios.get(url).then(res => {
                let value = res.data
                value.Gitlab_ID = id
                let toReturn = 0
                let all = value.statistics.counts.all
                let closed = value.statistics.counts.closed
                if(all != 0){
                  toReturn = Math.ceil((closed / all) * 100)
                }
                value.Percentage = toReturn
                me.mGetoverAllProjectIssuesStatistics(value)
              })
              .catch(err => {
                console.log(err)
                console.log(url)
              })
            }
          }
          me.blnLoading = false
          me.mSortObjGitlabProgjects(me.objAllProjectsIssuesStatistics)
        }
        getall()
      },
      mSortObjGitlabProgjects(data){
        let myData = this.objGitlab_Projects.map(rec => {
          let objPercentage = data.find(recA => {
            return recA.Gitlab_ID == rec.Gitlab_ID
          })
          if(objPercentage != undefined){
            rec.Percentage = objPercentage.Percentage
          }
          else{
            rec.Percentage = 0
          }
          return rec
        })
        if(this.blnAsc){
          myData.sort(function (a,b){
            return a.Percentage - b.Percentage
          })
        }
        else{
          myData.sort(function (a,b){
            return b.Percentage - a.Percentage
          })
        }
        this.objGitlab_Projects = myData
        let qparamsName = this.$route.query.name
        if(qparamsName != undefined && qparamsName != "" && qparamsName != null){
          this.mChangeSearchParams(qparamsName)
        }
        else{
          this.intPageNo = 1
          this.mChangeSearch()
        }
      },
      mGetAllProjects(data){
        this.objProjects = this.objProjects.concat(data)
      },
      mGetAllProjectIssuesStatistics(data){
        this.objProjectsIssuesStatistics = this.objProjectsIssuesStatistics.concat(data)
      },
      mGetoverAllProjectIssuesStatistics(data){
        this.objAllProjectsIssuesStatistics = this.objAllProjectsIssuesStatistics.concat(data)
        if(this.blnAsc){
          this.objAllProjectsIssuesStatistics.sort(function (a,b){
            return a.Percentage - b.Percentage
          })
        }
        else{
          this.objAllProjectsIssuesStatistics.sort(function (a,b){
            return b.Percentage - a.Percentage
          })
        }
      },
      mGetAllProjectCommits(data){
        this.objProjectCommits = this.objProjectCommits.concat(data)
      },
      mGetAllProjectIssues(data){
        this.objProjectIssues = this.objProjectIssues.concat(data)
      },
    },
  }
</script>
<!-- ============================================================================================== -->
<!-- =========================================== Styles =========================================== -->
<!-- ============================================================================================== -->
<style>
  #MyCard1{
    max-height: calc(100vh - 190px);
    min-height: calc(100vh - 190px);
    overflow-y: auto;
    overflow-x: auto;
  }

  #MyBorder{
    border: 1px solid #e0e0e0;
  }

  #MyBorderR{
    border-top: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
  }

  #MyBorderL{
    border-top: 1px solid #e0e0e0;
    border-left: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
  }

  #MyDiv{
    max-height: calc(100vh - 600px);
    min-height: calc(100vh - 600px);
    overflow-y: auto;
    overflow-x: auto;
  }

  #MyDiv1{
    max-height: calc(100vh - 270px);
    min-height: calc(100vh - 270px);
    overflow-y: auto;
    overflow-x: auto;
  }

  #MyDiv2{
    max-height: calc(100vh - 380px);
    min-height: calc(100vh - 380px);
    overflow-y: auto;
    overflow-x: auto;
  }

  #MyDiv2 .ant-list-item:hover{
    background-color: #eeeeea;
    cursor: pointer;
  }

  .v-progress-linear__content{
    z-index: 1;
  }

  .v-application ul, .v-application ol {
    padding-left: 0px;
  }
</style>