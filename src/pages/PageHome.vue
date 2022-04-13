<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-height full-width">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
        bottom-slots
        v-model="newQweetContent"
        placeholder="What's happening?"
        counter
        autogrow
        maxlength="280"
        dense="dense">
          <template v-slot:before>
            <q-avatar size="xl">
              <img src="https://cdn.quasar.dev/img/avatar5.jpg">
            </q-avatar>
          </template>
        </q-input>
        </div>
        <div class="col col-shrink"> 
          <q-btn unelevated rounded color="primary" label="Qweet" no-caps 
            @click="addNewQweet"
            :disable="!newQweetContent"
            class="q-mb-lg" />
        </div>
        
      </div>


      <q-separator size="10px" color="grey-2" />

      <q-list separator>

        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item
            v-for="qweet in qweets" 
            :key="qweet.id"
            class="q-py-md">
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar2.jpg">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>Danny Connell</strong>
                <span class="text-grey-7"> @danny_connell
                  <br class="lt-md"> &bull; {{ moment(qweet.date).fromNow() }}
                </span>
              </q-item-label>
              <q-item-label class="qweet-content text-body-1">
                {{ qweet.content }}
              </q-item-label>

              <div class="row justify-between q-mt-sm">
                <q-btn flat round color="grey" icon="far fa-comment" size="sm"/>
                <q-btn flat round color="grey" icon="fas fa-retweet" size="sm"/>
                <q-btn flat round 
                 :color="qweet.liked ? 'red':'grey'"
                 :icon="qweet.liked ? 'fa-solid fa-heart' : 'far fa-heart'" 
                 @click="toggleQweet(qweet)"
                 size="sm"/>
                <q-btn @click="deleteQweet(qweet.id)" flat round color="grey" icon="fas fa-trash" size="sm"/>
              </div>
            </q-item-section>
              
          </q-item>
        </transition-group>
        <q-separator inset="item" />

      </q-list>

    </q-scroll-area>
  </q-page>
</template>

<script>
import db from 'src/boot/firebase'
import { defineComponent } from 'vue'
import moment from 'moment';


export default defineComponent({
  name: 'PageHome',
  created: function() {
    this.moment = moment;
  },
  data(){
    return {
      newQweetContent: '',
       qweets:[
        // {
        //   id: 'ID1',
        //   content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit officiis repudiandae nemo quisquam. Blanditiis odit, enim sequi nemo aliquid officiis. Laudantium totam maxime nemo incidunt sint quam quos saepe mollitia?  ',
        //   date: 1649140467733,
        //   liked: true
                
        // },
        // {
        //   id: 'ID2',
        //   content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit officiis repudiandae nemo quisquam. Blanditiis odit, enim sequi nemo aliquid officiis. Laudantium totam maxime nemo incidunt sint quam quos saepe mollitia?  ',
        //   date: 1649140487090,
        //   liked: false
        // },
       ]
    }
  },
  methods:{
    addNewQweet(){
      console.log('test');
      let newQweet = {
        content: this.newQweetContent,
        date: Date.now(),
        liked: false,
      }
      db.collection("qweets").add(newQweet).then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
      }).catch((error) => {
          console.error("Error adding document: ", error);
      });
      this.newQweetContent = ''
    },
    deleteQweet(qweet){
      db.collection("qweets").doc(qweet).delete().then(() => {
          console.log("Document successfully deleted!");
      }).catch((error) => {
          console.error("Error removing document: ", error);
      });
    },
    toggleQweet(qweet){
      // Set the "capital" field of the city 'DC'
      db.collection("qweets").doc(qweet.id).update({
          liked: !qweet.liked
      })
      .then(() => {
          console.log("Document successfully updated!");
      })
      .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
      });
    }
  },
  computed:{
    relativeDate(){
      return formatDistance(subDays(new Date(), 3), new Date(), { addSuffix: true })
    }
  },
  mounted(){
    db.collection('qweets').orderBy('date').onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            let qweetChange = change.doc.data();
            qweetChange.id = change.doc.id;
            if (change.type === "added") {
                console.log("New qweet: ", qweetChange);
                this.qweets.unshift(qweetChange);
            }
            if (change.type === "modified") {
                console.log("Modified qweet: ", qweetChange);
                let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id);
                Object.assign(this.qweets[index], qweetChange);
            }
            if (change.type === "removed") {
                console.log("Removed qweet: ", qweetChange);
                let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id);
                this.qweets.splice(index,1);
            }
        });
    });
  }


})
</script>


<style lang="sass">
.qweet-content
  white-space: pre-line
</style>