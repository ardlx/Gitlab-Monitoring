import { mapState, mapMutations } from 'vuex'
import axios from "axios"
import moment from "moment"
const myPlugins = {
    install(Vue){
        Vue.mixin({
// ******************************************************************************* //
// ===================================== Data ==================================== //
// ******************************************************************************* //
            data:() => ({
                api: process.env.VUE_APP_URL,
                systemname: process.env.System_Name,
                dtDateNow: new Date(),
                dtDateNowForNotif: new Date(),
            }),
// *********************************************************************************** //
// ===================================== Computed ==================================== //
// *********************************************************************************** //
            computed:{
                ...mapState([
                    'sObjUserInfo',
                    'sIntCommits',
                    'sIntGetCommits',
                    'sIntDays',
                    'sIntListRouter',
                    'sBlnDrawer',
                    'sObjGitlabAdministrator',
                    'sObjNotificationData',
                ]),
                blnAdministrator(){
                    let data = this.sObjGitlabAdministrator.filter(rec => {
                        return rec.Email == this.sObjUserInfo && rec.UserRights == 2
                    })
                    return data.length != 0
                },
                csintUserID(){
                    let id = null
                    let data = this.sObjGitlabAdministrator.find(rec => {
                        return rec.Email == this.sObjUserInfo
                    })
                    if(data != undefined){
                        id = data.ID
                    }
                    return id
                },
                intAdministratorID(){
                    let data = this.sObjGitlabAdministrator.filter(rec => {
                        return rec.Email == this.sObjUserInfo
                    })
                    if(data.length == 0){
                        return null
                    }
                    else{
                        return data[0].ID
                    }

                }
            },
// ********************************************************************************** //
// ===================================== Created ==================================== //
// ********************************************************************************** //
            created(){
                setInterval(this.mGetDate, 1000)
                this.$notification.config({ placement: "bottomRight", duration: 3 })
            },
// ******************************************************************************* //
// =================================== Methods =================================== //
// ******************************************************************************* //
            methods:{
                moment,
                ...mapMutations([
                    'CHANGE_sObjUserInfo',
                    'CHANGE_sIntCommits',
                    'CHANGE_sIntGetCommits',
                    'CHANGE_sIntDays',
                    'CHANGE_sIntListRouter',
                    'CHANGE_sBlnDrawer',
                    'CHANGE_sObjGitlabAdministrator',
                    'CHANGE_sObjNotificationData',
                ]),
                mGetDate(){
                    this.dtDateNow = moment(new Date()).format("YYYY/MM/DD H:mm:ss")
                    this.dtDateNowForNotif = moment(new Date()).add({ seconds: 20 }).format("YYYY/MM/DD H:mm:ss") // 2021-10-06
                },
                smGetGitlabAdministrators(){
                    let url = `${this.api}/GitlabAdministrator`
                    axios.get(url).then(res => {
                        this.$store.commit("CHANGE_sObjGitlabAdministrator", res.data)
                    })
                    .catch(err => {
                        console.log(err)
                        console.log(url)
                    })
                },
                smGetNotificationData(){
                    let url = `${this.api}/NotificationData`;
                    axios.get(url).then(res => {
                        this.$store.commit("CHANGE_sObjNotificationData", res.data)
                    })
                    .catch(err => {
                        console.log(err)
                        console.log(url)
                    })
                },
                smGetNotification(){
                    let self = this
                    async function getall(){
                        for(let a = 0; a < self.sObjNotificationData.length; a++){
                            const id = self.sObjNotificationData[a].Gitlab_ID
                            if(id != null && id != "" && id != undefined){
                                let url = `http://10.169.141.8:5050/api/v4/projects/${id}?private_token=mxus9a5iYWGjkw_TqTsD&page=1&per_page=100` //gitlab_api
                                await axios.get(url).then(res => {
                                    let myData = res.data
                                    myData.NotifDate = self.sObjNotificationData[a].NotifDate
                                    self.smGetNotifData(myData)
                                })
                                .catch(err => {
                                    console.log(err)
                                    console.log(url)
                                }).finally(() => { })
                            }
                        }
                    }
                    getall()
                },
                smGetNotifData(myData){
                    let self = this
                    async function getNotif(){
                        let DatasobjDataInfo = myData
                        const id = DatasobjDataInfo.id
                        let href = `/Project?name=${self.smChangeSpace(DatasobjDataInfo.name)}`

                        // let notifDate = moment(DatasobjDataInfo.NotifDate).subtract({ hours: 16, minutes: 8, seconds: 5 }).format()
                        // let notifDate = moment(DatasobjDataInfo.NotifDate).format()
                        let notifDate = moment(DatasobjDataInfo.NotifDate).subtract({ hours: 8, minutes: 0, seconds: 0 }).format() // 2021-10-06
                        

                        let url = `http://10.169.141.8:5050/api/v4/projects/${id}/issues?private_token=mxus9a5iYWGjkw_TqTsD&page=1&per_page=100&updated_after=${notifDate}` //gitlab_api
                        console.log(url)
                        await axios.get(url).then(res => {
                            let notifData = res.data
                            for(let i = 0; i < notifData.length; i++){
                                let infor = notifData[i]

                                // let updated_at = moment(infor.updated_at).add({ minutes: 7, seconds: 5 }).format('LLL')
                                // let updated_at = moment(infor.updated_at).format('LLL')
                                let updated_at = moment(infor.updated_at).subtract({ hours: 8, minutes: 0, seconds: 0 }).format('LLL') // 2021-10-06

                                setTimeout(function(){
                                    self.$notification.open({
                                        style: "background-color: #00417A;color:white",
                                        duration: 0,
                                        icon: <a-avatar src={DatasobjDataInfo.avatar_url} shape="square" >{DatasobjDataInfo.name.substring(0, 1).toUpperCase()}</a-avatar>,
                                        message: <a href={href}>{DatasobjDataInfo.name}</a >,
                                        description: <div>
                                                     <i><b> *===== {infor.state.toUpperCase()} ISSUES =====* </b></i>
                                                     <br></br>
                                                     <b>TITLE : </b>{infor.title}
                                                     <br></br>
                                                     <b>DESCRIPTION : </b>{infor.description}
                                                     <br></br>
                                                     <b>DATE : </b>{updated_at}
                                                     </div>,
                                        onClose: () => self.smNotifClose(notifData[i].project_id),
                                    });
                                }, 1000);
                            }
                        })
                        .catch(err => {
                            console.log(err)
                            console.log(url)
                        })
                    }
                    getNotif()
                },
                smOpenSystemName(){
                    let query = {
                        name: this.smChangeSpace('Inventory Management System')
                    }
                    if(this.$router.app._route.query.name != query.name){
                        this.$router.push({
                            path: "/Project",
                            query: query,
                        })
                        if(this.$router.app._route.path == '/Project'){
                            location.reload()
                        }
                    }
                },
                smChangeSpace(el){
                    let data = el
                    data = data.replace("(", "")
                    data = data.replace(")", "")
                    data = data.replace(".", "")
                    data = data.replace(/,/gi, "")
                    data = data.replace(/ /gi, "")
                    return data
                },
                smNotifClose(Gitlab_ID){
                    let url = `${this.api}/NotificationDataInsertUpdate`;
                    let Data = { Gitlab_ID: Gitlab_ID, NotifDate: this.dtDateNowForNotif, DeletedDate: null, UpdatedDate: this.dtDateNow, UpdatedByUserID: this.csintUserID } // 2021-10-06
                    axios.post(url, Data).then(res => {
                        console.log(res.data)
                    })
                    .catch(err => {
                        console.log(err)
                        console.log(url)
                    })
                    .finally(() => {
                        this.smGetNotificationData()
                    })
                },
            }
        })
    }
}

export default myPlugins