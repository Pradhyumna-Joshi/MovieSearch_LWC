import { LightningElement, wire } from 'lwc';
import { MessageContext, publish } from 'lightning/messageService';
import MovieChannel from '@salesforce/messageChannel/movie__c'
export default class MovieSearch extends LightningElement {

    
    BASE_URL=''
    API_KEY = ''
    IMAGE_POSTER_PATH = ''
    

    movie;
    data;
    popular;
    error;
    selectedMovieId;

    @wire(MessageContext)
    messageContext

    handleChange(e){
        let {name,value} = e.target
        if(name==='search'){
            this.movie=value;
            console.log(this.movie)
        }

        // delay api call
       clearTimeout(this.timeout)
        this.timeout = setTimeout(()=>{
            let url  = this.BASE_URL+`/search/movie?query=${this.movie}&api_key=`+this.API_KEY
            this.getMovies(url,"main")
        },500)

    }

    handleClick(e){
        // console.log(e.detail)
        this.selectedMovieId = e.detail
        publish(this.messageContext,MovieChannel,{
            id : this.selectedMovieId
        })

    }

    connectedCallback(){
        
        this.getMovies(this.BASE_URL+'/movie/top_rated?api_key='+this.API_KEY,"main")
        this.getMovies(this.BASE_URL+'/movie/popular?api_key='+this.API_KEY,"popular")
    }

    async getMovies(url,loc){
      
        try {
            const res = await fetch(url,{
                method:'GET'
            })
            const data = await res.json()
            console.log(data)
            if(loc==="main"){
                this.data = data.results.map((item,index)=>(
                    {...item,
                        poster_path : this.IMAGE_POSTER_PATH+item.poster_path
                    }
                ))
            }else{
                console.log("popular",data)
                data.results.splice(10)
                this.popular = data.results.map((item,index)=>(
                    {...item,
                        poster_path : this.IMAGE_POSTER_PATH+item.poster_path
                    }
                ))
            }
           
            
            this.error=undefined
        } catch (error) {
            this.data=undefined
            this.error = error
            console.log(error)
        }
       
    }

    
   
}