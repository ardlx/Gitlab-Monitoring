import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Project*',
        component: () =>
            import ( /* webpackChunkName: "Project" */ '../views/T_ProjectList.vue')
    },

    {
        path: '/Project*',
        name: 'Project*',
        component: () =>
            import ( /* webpackChunkName: "Project" */ '../views/T_ProjectList.vue')
    },

    {
        path: '/DailyCommits',
        name: 'Home',
        component: Home
    },

    {
        path: '/Programmers*',
        name: 'Programmers*',
        component: () =>
            import ( /* webpackChunkName: "Programmers" */ '../views/T_ProgrammersSystemsList.vue')
    },

    {
        path: '/Member*',
        name: 'Member*',
        component: () =>
            import ( /* webpackChunkName: "Member" */ '../views/M_Member.vue')
    },

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router