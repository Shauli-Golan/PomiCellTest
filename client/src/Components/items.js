import React, { Component } from 'react';
//import Items from './Components/items'

class Items extends Component {
    constructor() {
      super();
      this.state = {        
        items: []
      };
    }

    componentDidMount(){
        //call server in order to get data
        fetch('/api/items')
        .then(res => {
            if (!res.ok) {
                throw new Error("Bad response");
              }
              console.log("ok ---- " + this.state.items);
              return res.json();
            })
        .then(items => this.setState({items}, () => console.log('items fetched...', items)))
        .catch(error => console.error(error));
    }

    render() {
        if(this.state.items.length > 0){
            return (
                <div>
                    <h1>File Data</h1>
                </div>
            );
        }
        return(' ');            
    }    
}

export default Items;
//render(<Item />, document.getElementById("root"));
  