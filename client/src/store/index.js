import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        sBlnDrawer: true,
        
        sObjUserInfo: "",

        sIntCommits: 1,
        sIntGetCommits: 2,
        sIntDays: 14,
        sIntListRouter: 0,

        sObjGitlabAdministrator: [],
        sObjNotificationData: [],

        gitlab_api: 'http://10.169.141.8:5050'

    },
    mutations: {
        CHANGE_sObjUserInfo: (state, data) => {
            state.sObjUserInfo = data
        },
        CHANGE_sIntCommits: (state, data) => {
            state.sIntCommits = data
        },
        CHANGE_sIntGetCommits: (state, data) => {
            state.sIntGetCommits = data
        },
        CHANGE_sIntDays: (state, data) => {
            state.sIntDays = data
        },
        CHANGE_sIntListRouter: (state, data) => {
            state.sIntListRouter = data
        },
        CHANGE_sBlnDrawer: (state, data) => {
            state.sBlnDrawer = data
        },
        CHANGE_sObjGitlabAdministrator: (state, data) => {
            state.sObjGitlabAdministrator = data
        },
        CHANGE_sObjNotificationData: (state, data) => {
            state.sObjNotificationData = data
        },
    },
    actions: {},
    modules: {},
    // getters : {
    //     gitlab_api:  state =>{
    //         return state.gitlab_api
    //     }
    // },
    plugins: [createPersistedState()]
})