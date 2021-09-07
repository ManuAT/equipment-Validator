import axios from 'axios'



export default function ApiService() {


    //  axios.get(`http://localhost:8081/api/client`, {  })
    // .then(res => {
    //   // console.log(res);
    //   console.log(res.data);
    //   return res.data
    // }).catch(error => {
    //       console.error('There was an error!', error);
    //   });

}

export const api = async () => {

   const client = await axios.get(`http://localhost:8081/api/client`, {  })
                    .then(res => {
                    // console.log(res);
                    // console.log(res.data);
                    return res.data
                    }).catch(error => {
                        console.error('There was an error!', error);
                    })
    const subcommunity = await axios.get(`http://localhost:8081/api/subcommunity`, {  })
                    .then(res => {
                    // console.log(res);
                    // console.log(res.data);
                    return res.data
                    }).catch(error => {
                        console.error('There was an error!', error);
                    })
    const community = await axios.get(`http://localhost:8081/api/community`, {  })
                    .then(res => {
                    // console.log(res);
                    // console.log(res.data);
                    return res.data
                    }).catch(error => {
                        console.error('There was an error!', error);
                    })   
                    
    const site = await axios.get(`http://localhost:8081/api/site`, {  })
                .then(res => {
                // console.log(res);
                // console.log(res.data);
                return res.data
                }).catch(error => {
                    console.error('There was an error!', error);
                })
    // console.log(client,subcommunity,community,site)
    localStorage.setItem('api',JSON.stringify({client,subcommunity,community,site}))
    // return {client,subcommunity,community,site} 
    
    }

    
