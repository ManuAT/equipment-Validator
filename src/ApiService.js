import React from 'react'
import axios from 'axios'



export default function ApiService() {

    // const auth = {
    //     userName: 'riyas@nectarit',
    //     password:'Welcome@123'
    //   };
  
    //   axios.post(`https://assets.nectarit.com/api/token/login`, { auth })
    //   .then(res => {
    //     console.log(res);
    //     console.log(res.data);
    //   }).catch(error => {
    //         console.error('There was an error!', error);
    //     });
    // axios.post(baseURL, {
    //     title: "Hello World!",
    //     body: "This is a new post."
    //   }).then((response) => {
    //     // setPost(response.data);
    //     console.log(response)
    //   });
    function handleGetDomian() {
    
        return [{
            id: 'nectarit',
            name: 'nectarit'
            }, {
                id: 'emaar',
                name: 'emaar'
            },
            {
              id: 'netix',
              name: 'netix'
            }
          ]
    }


    return (
        <div>   
            
        </div>
    )
}

