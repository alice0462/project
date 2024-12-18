import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'
import RandomDestination from "../components/RandomDestination.vue";
import ChooseDestination from "../components/ChooseDestination.vue";
import Level from '../components/Level.vue';
import GameMasterCode from '../components/GameMasterCode.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Start',
      component: StartView
    },
      {
      path: '/poll/',
      name: 'PollView',
      component: () => import('../views/PollView.vue')
    },
    {
      path: '/prelobby/',
      name: 'PreLobby',
      component: () => import('../views/PreLobby.vue')
    },
    {
      path: '/create/:id',
      name: 'CreateView',
      component: () => import('../views/CreateView.vue')
    },
    {
      path: '/result/:id',
      name: 'ResultView',
      component: () => import('../views/ResultView.vue')
    },
    {
      path: '/random-destination/:id',
      name: 'RandomDestination',
      component: RandomDestination, // Länkar till din komponent
    },
    {
      path: '/choose-destination/:id',
      name: 'ChooseDestination',
      component: ChooseDestination, // Länkar till din komponent
    },
    {
      path: '/level/:id',
      name: 'Level',
      component: Level,
    },
    {
      path: "/lobby/:id",
      name: "Lobby",
      component: () => import('../views/Lobby.vue')
    },

    {
      path: "/participant-answer/:id",
      name: "ParticipantAnswer",
      component: () => import('../views/ParticipantAnswer.vue')
    },
    {
      path: "/game/:id",
      name: "Game",
      component: () => import('../views/Game.vue')
    },
    {
      path: "/answers/",
      name: "Answers",
      component: () => import('../views/Answers.vue')
    },
    /*{
      path: "/pollview",
      name: "PollView",
      views: PollView,
    },*/
  ]
})

export default router
