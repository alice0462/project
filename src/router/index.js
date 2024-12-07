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
      path: '/lobby/',
      name: 'LobbyView',
      component: () => import('../views/LobbyView.vue')
    },
    {
      path: '/create/',
      name: 'CreateView',
      component: () => import('../views/CreateView.vue')
    },
    {
      path: '/result/:id',
      name: 'ResultView',
      component: () => import('../views/ResultView.vue')
    },
    {
      path: '/random-destination',
      name: 'RandomDestination',
      component: RandomDestination, // Länkar till din komponent
    },
    {
      path: '/choose-destination',
      name: 'ChooseDestination',
      component: ChooseDestination, // Länkar till din komponent
    },
    {
      path: '/level',
      name: 'Level',
      component: Level,
    },
    {
      path: "/game-master-code",
      name: "GameMasterCode",
      component: GameMasterCode,
    },
  ]
})



export default router
