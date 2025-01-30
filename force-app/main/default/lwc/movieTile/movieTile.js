import { LightningElement, api } from 'lwc';

export default class MovieTile extends LightningElement {

    
    @api movie
    
    handleClick(){
        this.dispatchEvent(new CustomEvent("clicked",{
            detail:this.movie.id
        }))
    }
    

   

}