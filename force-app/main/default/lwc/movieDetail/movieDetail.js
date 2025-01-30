import { MessageContext, unsubscribe, subscribe } from 'lightning/messageService';
import { LightningElement, wire } from 'lwc';
import MovieChannel from '@salesforce/messageChannel/movie__c'
export default class MovieDetail extends LightningElement {

    BASE_URL='https://api.themoviedb.org/3'
    API_KEY = '8a29ed49c0a95ec632c4d41ce98a0fb6'
    IMAGE_POSTER_PATH = 'https://image.tmdb.org/t/p/original'

    subscription=null
    movieId;
    data;
    error;
    genres;
    credits;
    
    @wire(MessageContext) messageContext

    connectedCallback(){
        if(this.subscription==null){
            this.subscription=subscribe(this.messageContext,MovieChannel,({id})=>{
               this.handleMessage(id)
            })
        }
    }


    handleMessage(id){
        this.movieId = id;
        console.log("detail",id)
        this.getMovieById()
        this.getCastDetails()
    }

    async getMovieById(){
        try {
            console.log('here')
            const response = await fetch(`${this.BASE_URL}/movie/${this.movieId}?language=en-US&api_key=${this.API_KEY}`,{
                method:'GET'
            })
            const data = await response.json()
            this.genres = data.genres.map((item)=>(
                item.name
            ))
            data.backdrop_path = this.IMAGE_POSTER_PATH+data.backdrop_path
            this.data = data
            this.error= undefined
        } catch (error) {
            this.error = error
            console.log(error)
        }
    }

    async getCastDetails(){
        try {
            const response = await fetch(`${this.BASE_URL}/movie/${this.movieId}/credits?language=en-US&api_key=${this.API_KEY}`)
            const data = await response.json();
           
            data.cast.splice(10)
            console.log(data.cast)
            this.credits = data.cast.map((item)=>({
                ...item,
                profile_path : this.IMAGE_POSTER_PATH + item.profile_path
            }))
        } catch (error) {
            this.error = error
            console.log(error)
        }
    }
    disconnectedCallback(){
        unsubscribe(this.subscription)
        this.subscription = null
    }
}