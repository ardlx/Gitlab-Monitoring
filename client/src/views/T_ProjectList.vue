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
                <v-col cols="2">
                  <a-input-search allowClear v-model="strSearch" placeholder="Project Name" @input="(intPageNo = 1), mChangeSearch()"/>
                </v-col>

                <v-col cols="2">
                  <a-select showSearch :filter-option="filterOption" allowClear v-model="strFilterCompanies" placeholder="Company User" @change="(intPageNo = 1), mChangeSearch(), (strFilterDepartments = undefined)" style="width: 100%">
                    <a-select-option v-for="item in arrCompanies" :key="item.CompanyName" :value="item.CompanyName">{{ item.CompanyName }}</a-select-option>
                  </a-select>
                </v-col>

                <v-col cols="2">
                  <a-select showSearch :filter-option="filterOption" allowClear v-model="strFilterDepartments" placeholder="Department User" @change="(intPageNo = 1), mChangeSearch()" style="width: 100%">
                    <a-select-option v-for="item in filteredDepartmentsU" :key="item.DepartmentName" :value="item.DepartmentName">{{ item.DepartmentName }}</a-select-option>
                  </a-select>
                </v-col>

                <v-col cols="2"> <!-- 2021-08-26 -->
                  <a-select showSearch :filter-option="filterOption" allowClear v-model="strFilterJapaneseAdviser" placeholder="Japanese Adviser" @change="(intPageNo = 1), mChangeSearch()" style="width: 100%">
                    <a-select-option v-for="item in arrJapaneseAdvisers" :key="item.ID" :value="item.ID">{{ item.JapaneseAdviserName }}</a-select-option>
                  </a-select>
                </v-col>

                <v-col cols="2">
                  <a-select showSearch :filter-option="filterOption" allowClear v-model="strFilterSections" placeholder="Section Incharge" @change="(intPageNo = 1), mChangeSearch()" style="width: 100%">
                    <a-select-option v-for="item in arrSections" :key="item.SectionID" :value="item.SectionID">{{ item.SectionName }}</a-select-option>
                  </a-select>
                </v-col>

                <!-- <v-col cols="2">
                  <a-select showSearch :filter-option="filterOption" allowClear v-model="strFilterProjectOwner" placeholder="System Developer" @change="(intPageNo = 1), mChangeSearch()" style="width: 100%">
                    <a-select-option v-for="item in arrProjectOwner" :key="item.ProjectOwner" :value="item.ProjectOwner">{{ item.ProjectOwner }}</a-select-option>
                  </a-select>
                </v-col> -->

                <v-col cols="2">
                  <a-select showSearch :disabled="blnLoading" :filter-option="filterOption" allowClear v-model="strFilterProjectMember" placeholder="Project Member" @change="(intPageNo = 1), mGetMembersProjects()" style="width: 100%">
                    <a-select-option v-for="item in arrProjectMembetsList" :key="item.ID" :value="item.ID">{{ item.Name }}</a-select-option>
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
              <a-button @click="mAddnew()" type="primary" icon="plus-circle" v-if="blnAdministrator" style="background-color:green;">Add New</a-button>
              <v-spacer v-if="blnAdministrator"></v-spacer>
              <a-radio-group v-model="strFilterProjectCategory" :defaultValue="0" @change="(intPageNo = 1), mChangeSearch()"> <!-- 2021-08-26 -->
                <a-radio style="display:block; height:17px; font-size:12px;" :value="0"> All </a-radio>
                <a-radio style="display:block; height:17px; font-size:12px;" :value="1"> Production </a-radio>
                <a-radio style="display:block; height:17px; font-size:12px;" :value="2"> Support </a-radio>
              </a-radio-group>
              <v-spacer></v-spacer>
              <!-- <a-button :loading="blnLoading" @click="mGetAllProjectPercentage(), (blnAsc = !blnAsc)" type="primary" :icon="!blnAsc ? 'sort-ascending' : 'sort-descending'"> Sort {{ !blnAsc ? "Asc" : "Desc" }}</a-button> -->
              <a-button :loading="blnLoading" @click="mGetAllProjectPercentage(), (blnAsc = !blnAsc)" type="primary" :icon="!blnAsc ? 'sort-ascending' : 'sort-descending'"></a-button>
            </v-card-title>

            <v-card-text class="py-0">
              <a-list :loading="blnLoading" id="MyDiv2" size="small" item-layout="horizontal" :data-source="cPaginatedData" bordered>
                <a-list-item :id="mChangeSpace(item.Name)" slot="renderItem" slot-scope="item" :style="`background-color:${ objInfo.ID == item.ID ? '#90CAF9' : item.Gitlab_ID == null ? '#7CB342' : ''}`">
                  
                  <a-list-item-meta @click="mClickProject(item)">
                    <a-avatar slot="avatar" size="large" class="mt-4" shape="square" :src="item.Avatar">{{ item.Name.substring(0, 1).toUpperCase() }}</a-avatar>

                    <span slot="title">
                      <a-tooltip placement="right" :title=" item.URL == null ? '' : 'Double click to open project' ">
                        <a v-if="item.URL != null" :style="`font-size:17px;color:${ item.Name != mFindGitlabName(item.Gitlab_ID) ? item.Gitlab_ID == null ? '' : 'red' : '' };text-decoration: underline;`" @dblclick="mOpenURL(item.URL)">{{ item.Name }}</a>
                        <span v-else :style="`font-size:17px;color:${ item.Name != mFindGitlabName(item.Gitlab_ID) ? item.Gitlab_ID == null ? '' : 'red' : 'black' }`">{{ item.Name }}</span>
                      </a-tooltip>
                    </span>
                
                    <span slot="description">
                      <span>
                        <span class="gray--text" style="font-size:14px;"> {{item.SectionHead !== null && item.SectionHead !== undefined && item.SectionHead !== 0 ? 'Section | SH:' : 'Section:' }} </span> <!-- 2021-08-26 -->
                        <span class="black--text" style="font-size:15px;"> {{ mGetSectionName(item.SectionID) }} {{item.SectionHead !== null && item.SectionHead !== undefined && item.SectionHead !== 0 ? '|' : '' }} {{ mGetSectionHeadName(item.SectionHead) }} </span> <!-- 2021-08-26 -->
                      </span>
                      <br>
                      <span>
                        <span class="gray--text" style="font-size:14px;"> JA: </span> <!-- 2021-08-26 -->
                        <span class="black--text" style="font-size:15px;"> {{ mGetJapaneseAdviserName(item.JapaneseAdviser) }} </span> <!-- 2021-08-26 -->
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
                <v-row no-gutters justify="center" class="mt-1">
                  <v-col align="center">
                    <a-select :filter-option="filterOption" v-model="intRowNo" placeholder="Row No" style="width: 60%" @change="(intPageNo = 1), mChangeSearch()">
                      <a-select-option v-for="item in arrPagenation" :key="item.No" :value="item.No">
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
                <v-row id="MyBorder" no-gutters style="padding: 8px 1px 1px 8px" justify="center">
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
            <a-result v-if="blnLoading === true" title="Gathering Data..." >
              <template #icon>
                <a-icon type="gitlab" />
              </template>

              <template #subTitle>
                <v-icon large class="pb-1" color="blue">mdi-hand</v-icon>
                <strong>{{`Please wait...`}}</strong>
              </template>
            </a-result>

            <a-result v-else-if="cPaginatedData.length == 0" title="No Data Found">
              <template #icon>
                <a-icon type="database" />
              </template>

              <template #subTitle>
                <a-button type="primary" size="small" icon="reload" @click="mChangeRouter()">Reload</a-button>
              </template>
            </a-result>

            <a-result v-else-if="objInfo.length == 0" title="Welcome to System Monitoring.">
              <template #icon>
                <a-icon type="gitlab" />
              </template>

              <template #subTitle>
                <v-icon large class="pb-1" color="blue" >mdi-hand-pointing-left</v-icon>
                <strong>{{ ` Click item from Project list to view project information.` }}</strong>
              </template>
            </a-result>
<!-- ======================================================================================= -->
<!-- ============================ Edit Project Informations ================================ -->
<!-- ======================================================================================= -->
            <template v-else>
              <v-card-title v-if=" blnAdministrator || sObjUserInfo ==  mFindGitlabMemberEmail( arrProjectInfo.owner != undefined ? arrProjectInfo.owner.id : 1 ) ">
                <v-icon left>mdi-information-variant</v-icon>Project Informations
                <v-spacer></v-spacer>
                <a-tooltip placement="left">
                  <span v-if=" objInfo.Avatar != arrProjectInfo.avatar_url && arrProjectInfo.length != 0 " slot="title" >Replace with avatar on Gitlab</span>
                  <span v-else slot="title">Project Avatar</span>
                  <a-avatar v-if="objInfo.Avatar != arrProjectInfo.avatar_url" shape="square" size="large" :src="objInfo.Avatar" @click="objInfo.Avatar = arrProjectInfo.avatar_url">{{ arrProjectInfo.name != undefined ? arrProjectInfo.name.substring(0, 1).toUpperCase() : "" }}</a-avatar>
                  <a-avatar v-else-if="arrProjectInfo.length != 0" shape="square" size="large" :src="objInfo.Avatar">{{ arrProjectInfo.name != undefined ? arrProjectInfo.name.substring(0, 1).toUpperCase() : "" }}</a-avatar>
                </a-tooltip>
              </v-card-title>

              <v-card-text v-if=" blnAdministrator || sObjUserInfo == mFindGitlabMemberEmail( arrProjectInfo.owner != undefined ? arrProjectInfo.owner.id : 1 ) ">
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

                  <a-form-item labelAlign="left" label="Expected Release Date" style="width:100%;">
                    <a-date-picker placeholder="Select Expected Release Date" allowClear style="width:100%" v-model="objInfo.ExpectedReleaseDate"/>
                  </a-form-item>

                  <a-form-item v-if="objInfo.Type == 3" labelAlign="left" label="Released Date" style="width:100%;">
                    <a-date-picker placeholder="Select Released Date" allowClear style="width:100%" v-model="objInfo.ReleasedDate"/>
                  </a-form-item>

                  <a-form-item v-if="blnAdministrator" labelAlign="left" label="Section Incharge" required style="width:100%;">
                    <a-select v-model="objInfo.SectionID" allowClear placeholder="Select Section Incharge" showSearch :filter-option="filterOption">
                      <a-select-option v-for="i in arrSections" :key="i.SectionID" :value="i.SectionID">{{ i.SectionName }}</a-select-option>
                    </a-select>
                  </a-form-item>

                  <a-form-item v-if="blnAdministrator" labelAlign="left" label="Section Head Incharge" required style="width:100%;"> <!-- 2021-08-26 -->
                    <a-select v-model="objInfo.SectionHead" allowClear placeholder="Select Section Head Incharge" showSearch :filter-option="filterOption">
                      <a-select-option v-for="i in arrSectionHeadAdvisers" :key="i.ID" :value="i.ID">{{ i.SectionHeadName }}</a-select-option>
                    </a-select>
                  </a-form-item>

                  <a-form-item v-if="blnAdministrator" labelAlign="left" label="Japanese Adviser" required style="width:100%;"> <!-- 2021-08-26 -->
                    <a-select v-model="objInfo.JapaneseAdviser" allowClear placeholder="Select Japanese Adviser" showSearch :filter-option="filterOption">
                      <a-select-option v-for="i in arrJapaneseAdvisers" :key="i.ID" :value="i.ID">{{ i.JapaneseAdviserName }}</a-select-option>
                    </a-select>
                  </a-form-item>

                  <a-form-item v-if="blnAdministrator" labelAlign="left" label="Project Name" required style="width:100%;">
                    <a-input allowClear placeholder="Input Project Name" v-model="objInfo.Name"></a-input>
                  </a-form-item>

                  <a-form-item labelAlign="left" label="Project URL" style="width:100%;">
                    <a-input allowClear placeholder="Input Project URL" v-model="objInfo.URL"></a-input>
                  </a-form-item>

                  <a-form-item v-if="blnAdministrator" labelAlign="left" label="Gitlab Project Name" style="width:100%;">
                    <a-select v-model="objInfo.Gitlab_ID" show-search placeholder="Select Gitlab Project" :filter-option="filterOption" allowClear @change="mGetInformation(objInfo.Gitlab_ID)">
                      <a-select-option v-for="i in arrProjects" :key="i.id" :value="i.id" >{{ i.name }}</a-select-option>
                    </a-select>
                  </a-form-item>

                  <a-form-item v-if="blnAdministrator" labelAlign="left" label="Department Category" style="width:100%;"> <!-- 2021-08-26 -->
                    <a-select v-model="objInfo.ProjectCategory" allowClear placeholder="Select Department Category" showSearch :filter-option="filterOption">
                      <a-select-option v-for="i in arrProjectCategory" :key="i.ID" :value="i.ID">{{ i.CategoryName }}</a-select-option>
                    </a-select>
                  </a-form-item>

                  <a-form-item v-if="blnAdministrator && !blnRemove && intType != 7" :wrapper-col="{ span: 24 }" style="width:100%"> <!-- 2021-02-18 --> <!-- 2021-02-23 -->
                    <v-row no-gutters>
                      <v-col style="margin-top:12px;">
                        <a-button block icon="delete" @click="blnRemove = !blnRemove" type="danger" :loading="blnLoading">Disposed</a-button>
                      </v-col>
                    </v-row>
                  </a-form-item>

                  <a-form-item v-if="blnRemove || intType == 7" labelAlign="left" label="Disposed Type" style="width:100%; margin-bottom:0px" help="Please select disposed type."> <!-- 2021-02-18 --> <!-- 2021-02-23 -->
                    <v-radio-group hide-details class="mt-0" row v-model="objInfo.DisposedType" dense>
                      <v-radio v-for="item in arrM_DisposedTypes" :key="item.DisposedTypesID" :label="item.DisposedTypesName.toUpperCase()" :value="item.DisposedTypesID"></v-radio>
                    </v-radio-group>
                  </a-form-item>

                  <a-form-item :wrapper-col="{ span: 24 }" style="width:100%;">
                    <v-row no-gutters>
                      <v-col style="margin-top:12px;">
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
                <a-descriptions :column="2" size="small" v-if="arrProjectInfo != undefined">
                  <a-descriptions-item label="Gitlab Project ID">
                    {{ arrProjectInfo.id }}
                  </a-descriptions-item>

                  <a-descriptions-item label="Gitlab Project Name">
                    <a-tooltip placement="top" title="Double click to open project in GITLAB">
                      <a @dblclick="mOpenURL(arrProjectInfo.web_url)" style="text-decoration: underline">{{ arrProjectInfo.name }}</a>
                    </a-tooltip>
                  </a-descriptions-item>

                  <a-descriptions-item label="Project Owner" v-if="arrProjectInfo.owner != undefined">
                    <a-tooltip placement="top" title="Double click to view project owner's information">
                      <a @dblclick="mOpenURL(arrProjectInfo.owner.web_url)" style="text-decoration: underline" >{{ arrProjectInfo.owner.name }}</a>
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
                    {{ moment(arrProjectInfo.created_at).format("YYYY-MM-DD") }}
                    ({{ moment(arrProjectInfo.created_at).fromNow() }})
                  </a-descriptions-item>

                  <a-descriptions-item label="Last Activity">
                    {{ moment(arrProjectInfo.last_activity_at).format("YYYY-MM-DD") }}
                    ({{ moment(arrProjectInfo.last_activity_at).fromNow() }})
                  </a-descriptions-item>

                  <a-descriptions-item label="Department Category"> <!-- 2021-08-26 -->
                    {{mGetProjectCategoryName(objInfo.ProjectCategory)}}
                  </a-descriptions-item>

                  <a-descriptions-item label="Description">
                    {{ arrProjectInfo.description }}
                  </a-descriptions-item>
                </a-descriptions>
              </v-card-text>
<!-- ================================================================================== -->
<!-- ============================ Project Users ======================================= -->
<!-- ================================================================================== -->
              <v-card-title>
                <v-icon left>mdi-account-group-outline</v-icon>Project Users
                <v-spacer></v-spacer>
                <a-button @click=" (blnEditUser = true), (strAddCompanies = undefined), (strAddDepartments = undefined) " type="primary" icon="edit" v-if=" blnAdministrator || sObjUserInfo == mFindGitlabMemberEmail( arrProjectInfo.owner != undefined ? arrProjectInfo.owner.id : 1 ) ">Edit Users</a-button>
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
                <a-list size="small" item-layout="horizontal" :data-source="arrProjectMembers" bordered>
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
                    <span slot="tab">{{ a == 1 ? "All" : a == 2 ? "Open" : "Closed" }} ({{ a == 1 ? arrProjectIssues.length : mFilterIssues(a == 2 ? "opened" : "closed").length }})</span>
                    <a-list size="small" item-layout="horizontal" :data-source=" a == 1 ? arrProjectIssues : mFilterIssues(a == 2 ? 'opened' : 'closed') " bordered :pagination="{ pageSize: 5, showLessItems: true }">
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
                <v-select v-if="arrProjectBranches.length > 1" :items="arrProjectBranches" v-model="strFilterBranches" item-text="name" item-value="name" solo dense hide-details @change="mGetProjectCommits(objInfo.Gitlab_ID)"></v-select>
                <v-spacer></v-spacer>
              </v-card-title>

              <v-card-text>
                <a-list size="small" item-layout="horizontal" :data-source=" arrProjectInfo.empty_repo == false ? arrProjectCommits : [] " bordered :pagination="{ pageSize: 5, showLessItems: true }">
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
            <a-select-option v-for="i in arrSections" :key="i.SectionID" :value="i.SectionID" >
              {{ i.SectionName }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item v-if="blnAdministrator" labelAlign="left" label="Section Head Incharge" required style="width:100%;">
          <a-select v-model="objInfoNew.SectionHead" allowClear placeholder="Select Section Head Incharge" showSearch :filter-option="filterOption">
            <a-select-option v-for="i in arrSectionHeadAdvisers" :key="i.ID" :value="i.ID">{{ i.SectionHeadName }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item v-if="blnAdministrator" labelAlign="left" label="Japanese Adviser" required style="width:100%;">
          <a-select v-model="objInfoNew.JapaneseAdviser" allowClear placeholder="Select Japanese Adviser" showSearch :filter-option="filterOption">
            <a-select-option v-for="i in arrJapaneseAdvisers" :key="i.ID" :value="i.ID">{{ i.JapaneseAdviserName }}</a-select-option>
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
              v-for="i in arrProjects" :key="i.id" :value="i.id" >{{ i.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item v-if="blnAdministrator" labelAlign="left" label="Department Category" style="width:100%;">
          <a-select v-model="objInfoNew.ProjectCategory" allowClear placeholder="Select Department Category" showSearch :filter-option="filterOption">
            <a-select-option v-for="i in arrProjectCategory" :key="i.ID" :value="i.ID">{{ i.CategoryName }}</a-select-option>
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
            <a-select-option v-for="item in arrCompanies" :key="item.CompanyName" :value="item.CompanyName">
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
            <a-select-option v-for="item in strAddCompanies != 'All Company' && strAddCompanies != undefined ? filteredDepartmentsAdd : arrDepartmentsDistinct" :key="item.DepartmentName" :value="item.DepartmentName">
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
        blnMemberFilter: false,

        intType: 0,
        intPageNo: 1,
        intRowNo: 10,

        strToDate: new Date(),
        strFilterBranches: "",
        strSearch: undefined,
        strFilterProjectCategory: undefined,
        strFilterCompanies: undefined,
        strFilterDepartments: undefined,
        strFilterSections: undefined,
        strFilterJapaneseAdviser: undefined,
        strFilterProjectOwner: undefined,
        strFilterProjectMember: undefined,
        strAddCompanies: undefined,
        strAddDepartments: undefined,
        strNoDataImage: Empty.PRESENTED_IMAGE_SIMPLE,
        
        objInfo: {},
        objInfoNew: {},

        arrM_DisposedTypes: [],
        arrCompanies: [],
        arrJapaneseAdvisers: [],
        arrSectionHeadAdvisers: [],
        arrProjectCategory: [],
        arrDepartments: [],
        arrDepartmentsDistinct: [],
        arrSections: [],
        arrUsers: [],
        arrProjects: [],
        arrProjectList: [],
        arrMemberProjects: [],
        arrProjectInfo: [],
        arrProjectUsers: [],
        arrProjectIssues: [],
        arrProjectMembers: [],
        arrProjectMembetsList: [],
        arrProjectBranches: [],
        arrProjectCommits: [],
        arrProjectOwner: [],
        arrGitlabProjects: [],
        arrProjectsIssuesStatistics: [],
        arrAllProjectsIssuesStatistics: [],
        arrPagenation: [ { No: 0 }, { No: 10 }, { No: 20 }, { No: 30 }, { No: 40 }, { No: 50 }, ],
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
      this.strFilterProjectCategory = 0
      this.mGetProjects()
      this.mGetGitlab_Projects()
      setInterval(this.mGetDateNow, 1000)
      this.mGetUsers()
      this.mGetCompanies()
      this.mGetDepartments()
      this.mGetDepartmentsDistinct()
      this.mGetSections()
      // this.mGetProjectOwner()
      this.mGetM_DisposedTypes()
    },
// *********************************************************************************** //
// ===================================== Computed ==================================== //
// *********************************************************************************** //
    computed:{
      filteredSearch(){
        let data = this.arrGitlabProjects
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
        if(this.strFilterJapaneseAdviser != undefined){ // 2021-08-26
          data = data.filter(rec => {
            return rec.JapaneseAdviser == this.strFilterJapaneseAdviser
          })
        }
        if(this.strFilterSections != undefined){
          data = data.filter(rec => {
            return rec.SectionID == this.strFilterSections
          })
        }
        if(this.strFilterProjectCategory != 0){ // 2021-08-26
          data = data.filter(rec => {
            return rec.ProjectCategory == this.strFilterProjectCategory || rec.ProjectCategory == 3
          })
        }
        // if(this.strFilterProjectOwner != undefined){ // 2021-08-26
        //   data = data.filter(rec => {
        //     return rec.ProjectOwner == this.strFilterProjectOwner
        //   })
        // }
        if(this.strFilterProjectMember != undefined){ // 2021-08-26
          let MemberProjects = this.arrMemberProjects.map(rec => {
            return rec.ProjectID 
          })
          
          data = data.filter(rec => {
            return MemberProjects.includes(rec.ID)
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
          data = this.arrDepartments
          data = data.filter(rec => {
            return rec.CompanyCode == this.objInfo.CompanyCode
          })
        }
        return data
      },
      filteredDepartmentsU(){
        let data = []
        if(this.strFilterCompanies != "" && this.strFilterCompanies != undefined){
          data = this.arrDepartments
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
          data = this.arrDepartments
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
        let data = this.arrGitlabProjects
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
        if(this.strFilterJapaneseAdviser != undefined){ // 2021-08-26
          data = data.filter(rec => {
            return rec.JapaneseAdviser == this.strFilterJapaneseAdviser
          })
        }
        if(this.strFilterSections != undefined){
          data = data.filter(rec => {
            return rec.SectionID == this.strFilterSections
          })
        }
        if(this.strFilterProjectCategory != 0){// 2021-08-26
          data = data.filter(rec => {
            return rec.ProjectCategory == this.strFilterProjectCategory || rec.ProjectCategory == 3
          })
        }
        // if(this.strFilterProjectOwner != undefined){// 2021-08-26
        //   data = data.filter(rec => {
        //     return rec.ProjectOwner == this.strFilterProjectOwner
        //   })
        // }
        if(this.strFilterProjectMember != undefined){// 2021-08-26
          let MemberProjects = this.arrMemberProjects.map(rec => {
            return rec.ProjectID 
          })
          
          data = data.filter(rec => {
            return MemberProjects.includes(rec.ID)
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
            // this.mClickProject(this.cPaginatedData[0]); // 2021-09-06
            this.objInfo = []; // 2021-09-06
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
        let data = this.arrGitlabProjects.filter(rec => {
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
        this.strToDate = new Date()
      },
      mFindMemberAvatar(email){
        let find = this.arrUsers.find(rec => {
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
            this.arrCompanies = res.data
        })
        .catch(err => {
          console.log(err)
          console.log(url)
        })
      },
      mGetDepartments(){
        let url = `${this.api}/Departments`
        axios.get(url).then(res => {
          this.arrDepartments = res.data
        })
        .catch(err => {
          console.log(err)
          console.log(url)
        })
      },
      mGetDepartmentsDistinct(){
        let url = `${this.api}/DepartmentsDistinct`
        axios.get(url).then(res => {
          this.arrDepartmentsDistinct = res.data
        })
        .catch(err => {
          console.log(err)
          console.log(url)
        })
      },
      mGetSections(){
        let url = `${this.api}/Sections`
        axios.get(url).then(res => {
          this.arrSections = res.data
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
        let objData = this.arrProjectsIssuesStatistics.find(rec => {
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
          this.arrProjectOwner = res.data
        })
        .catch(err => {
          console.log(err)
          console.log(url)
        })
      },
      mGetMembersProjects(){
        this.arrMemberProjects = []
        
        if(this.strFilterProjectMember != undefined && this.strFilterProjectMember != null && this.strFilterProjectMember != 0){
          this.blnLoading = true
          this.blnMemberFilter = true
          this.mGetProgrammerProjects()
        }
        else{
          this.mChangeSearch()
          this.blnMemberFilter = false
        }
      },
      mGetProgrammerProjects(){
        let TotalProjects = 0
        let ProjectCounter = 0
        let NotIncluded = 0
        let arrProjects = []

        const url = `${this.api}/GetProgrammersProjects`
        axios.get(url).then(res => {
          this.arrProjectList = res.data
          TotalProjects = this.arrProjectList.filter(rec => { return rec.Gitlab_ID != null }).length
          this.arrProjectList.forEach(ProjectDetails => {
            if(ProjectDetails.Gitlab_ID != null){
              const MembersAPI = `${this.$store.state.gitlab_api}/api/v4/projects/${ProjectDetails.Gitlab_ID}/members?private_token=mxus9a5iYWGjkw_TqTsD`
              axios.get(MembersAPI).then(Members => {
                const checkIfInclude = Members.data.map(MembersDetails => {return MembersDetails.id}).includes(this.strFilterProjectMember)
                  if(checkIfInclude){
                    ProjectCounter++
                    arrProjects.push({ProjectID: ProjectDetails.ID})
                  }
                  else{
                    ProjectCounter++
                    NotIncluded++
                  }
                  this.mGetProgrammerProjectsFinalCheck(TotalProjects, NotIncluded, ProjectCounter, arrProjects)
              })
              .catch(() => {
                ProjectCounter++
                NotIncluded++
                this.mGetProgrammerProjectsFinalCheck(TotalProjects, NotIncluded, ProjectCounter, arrProjects)
              })
            }
          })
        })
      },
      mGetProgrammerProjectsFinalCheck(TotalProjects, NotIncluded, ProjectCounter, arrProjects){
        if(TotalProjects == NotIncluded){
          this.blnLoading = false
        }
        else if((TotalProjects == ProjectCounter)){
          this.arrMemberProjects = arrProjects
          this.mChangeSearch()
          this.blnLoading = false
        }
      },
      mGetCompanyName(id){
        let data = this.arrCompanies.find(rec => {
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
        let data = this.arrDepartments.find(rec => {
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
        let data = this.arrSections.find(rec => {
          return rec.SectionID == id
        })
        if(data != undefined){
          return data.SectionName
        }
        else{
          return ""
        }
      },
      mGetSectionHeadName(id){
        let data = this.arrSectionHeadAdvisers.find(rec => {
          return rec.ID == id
        })
        if(data != undefined){
          return data.SectionHeadName
        }
        else{
          return ""
        }
      },
      mGetJapaneseAdviserName(id){
        let data = this.arrJapaneseAdvisers.find(rec => {
          return rec.ID == id
        })
        if(data != undefined){
          return data.JapaneseAdviserName
        }
        else{
          return ""
        }
      },
      mGetProjectCategoryName(id){
        let data = this.arrProjectCategory.find(rec => {
          return rec.ID == id
        })
        if(data != undefined){
          return data.CategoryName
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
        let find = this.arrUsers.find(rec => {
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
        let find = this.arrProjects.find(rec => {
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
        let find = this.arrUsers.find(rec => {
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
        let find = this.arrUsers.find(rec => {
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
        // this.objInfo = data
        this.blnRemove = false
        this.arrProjectInfo = []
        this.arrProjectUsers = []
        this.arrProjectIssues = []
        this.arrProjectMembers = []
        this.arrProjectBranches = []
        this.arrProjectCommits = []
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
        let data = this.arrProjectIssues.filter(rec => {
          return rec.state == filter
        })

        if(filter == 'opened'){
          return data
        }
        else if(filter == 'closed'){
          return data.sort((a,b) => (a.updated_at > b.updated_at) ? -1 : ((b.updated_at > a.updated_at) ? 1 : 0))
        }

      },
      mGetUsers(){
        let url = `${this.api}/Gitlab_User`
        axios.get(url).then(res => {
          this.arrUsers = res.data
        })
        .catch(err => {
          console.log(err)
          console.log(url)
        })
      },
      mGetM_DisposedTypes(){
        let url = `${this.api}/M_DisposedTypes`
        axios.get(url).then(res => {
          this.arrM_DisposedTypes = res.data
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
          this.arrGitlabProjects = theData
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
          data.Avatar = this.arrProjectInfo.avatar_url
          if(this.arrProjectInfo.owner != undefined){
            data.ProjectOwner = this.arrProjectInfo.owner.name
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
        data.CreatedDate = this.dtDateNow
        data.UpdatedDate = this.dtDateNow
        data.UpdatedByUserID = this.intAdministratorID
        let url = `${this.api}/Gitlab_ProjectsInsert`
        axios.post(url, data).then(res => {
          console.log(res.data)
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
            this.arrProjectInfo = [] // 2021-09-06
            this.arrProjectInfo = res.data
          })
          .catch(err => {
            console.log(err)
            console.log(url)
          })
        }
      },
      mGetProjectIssues(id){ // 2021-09-06
        const me = this

        async function getall(){
          me.arrProjectIssues = []
          for(let a = 1; a < 10; a++){
            let url = `${me.$store.state.gitlab_api}/api/v4/projects/${id}/issues?private_token=mxus9a5iYWGjkw_TqTsD&page=${a}&per_page=100`
            await axios.get(url).then(res => {
              me.mGetAllProjectIssues(res.data)
              if(res.data.length < 100){
                a = 10
              }
              // let data = res.data
              // if(data.length != 0){
              //   data.map(rec => {
              //     rec.due_date = rec.due_date == null ?
              //       "" : moment(rec.due_date).format("LL")
              //     return rec
              //   })
              // }
            })
            .catch(err => {
              console.log(err)
              console.log(url)
            })
          }
        }
        getall()
      },
      mGetProjectUsers(id){
        if(id != null && id != "" && id != undefined){
          let url = `${this.$store.state.gitlab_api}/api/v4/projects/${id}/users?private_token=mxus9a5iYWGjkw_TqTsD`
          axios.get(url).then(res => {
            this.arrProjectUsers = [] // 2021-09-06
            this.arrProjectUsers = res.data
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
            this.arrProjectMembers = [] // 2021-09-06
            this.arrProjectMembers = res.data
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
            this.arrProjectBranches = [] // 2021-09-06
            this.arrProjectBranches = res.data
            if(this.arrProjectBranches.length != 0){
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
        this.arrProjectCommits = []
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
        this.arrProjects = []
        this.arrProjectsIssuesStatistics = []
        const me = this
        async function getall(){
          me.mGetJapaneseAdvisers()
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
        this.arrProjectsIssuesStatistics = []
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
          // if(me.blnMemberFilter == true){
          //   me.blnLoading = false
          // }
        }
        getall()
      },
      mGetAllProjectPercentage(){
        let data = this.arrGitlabProjects
        let me = this
        this.blnLoading = true
        this.arrAllProjectsIssuesStatistics = []
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
          me.mSortObjGitlabProgjects(me.arrAllProjectsIssuesStatistics)
        }
        getall()
      },
      mSortObjGitlabProgjects(data){
        let myData = this.arrGitlabProjects.map(rec => {
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
        this.arrGitlabProjects = myData
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
        this.arrProjects = this.arrProjects.concat(data)
      },
      mGetAllProjectIssuesStatistics(data){
        this.arrProjectsIssuesStatistics = this.arrProjectsIssuesStatistics.concat(data)
      },
      mGetoverAllProjectIssuesStatistics(data){
        this.arrAllProjectsIssuesStatistics = this.arrAllProjectsIssuesStatistics.concat(data)
        if(this.blnAsc){
          this.arrAllProjectsIssuesStatistics.sort(function (a,b){
            return a.Percentage - b.Percentage
          })
        }
        else{
          this.arrAllProjectsIssuesStatistics.sort(function (a,b){
            return b.Percentage - a.Percentage
          })
        }
      },
      mGetAllProjectCommits(data){
        this.arrProjectCommits = this.arrProjectCommits.concat(data)
      },
      mGetAllProjectIssues(data){
        this.arrProjectIssues = this.arrProjectIssues.concat(data)
      },
      mGetJapaneseAdvisers(){
        let url = `${this.api}/GetJapaneseAdvisers`
        axios.get(url).then(res => {
          this.arrJapaneseAdvisers = res.data
          this.mGetSectionHeadAdvisers()
        })
        .catch(err => {
          console.log(err)
          console.log(url)
        })
      },
      mGetSectionHeadAdvisers(){
        let url = `${this.api}/GetSectionHeadAdvisers`
        axios.get(url).then(res => {
          this.arrSectionHeadAdvisers = res.data
          this.mGetProjectCategories()
        })
        .catch(err => {
          console.log(err)
          console.log(url)
        })
      },
      mGetProjectCategories(){
        let url = `${this.api}/GetProjectCategories`
        axios.get(url).then(res => {
          this.arrProjectCategory = res.data
          this.mGetProjectMembersList()
        })
        .catch(err => {
          console.log(err)
          console.log(url)
        })
      },
      mGetProjectMembersList(){
        let url = `${this.api}/GetMembersList`
        axios.get(url).then(res => {
          this.arrProjectMembetsList = res.data
        })
        .catch(err => {
          console.log(err)
          console.log(url)
        })
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