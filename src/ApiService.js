import axios from 'axios'


const baseUrl = "http://localhost:8081/api/"
// const baseUrl = "https://onboard-validator.herokuapp.com/api/"
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

   const client = await axios.get(baseUrl+'client', {  })
                    .then(res => {
                    // console.log(res);
                    // console.log(res.data);
                    return res.data
                    }).catch(error => {
                        console.error('There was an error!', error);
                    })
    // console.log('clientLenght'+client.length);
    // const subcommunity = await axios.get(baseUrl+'subcommunity', {  })
    //                 .then(res => {
    //                 // console.log(res);
    //                 // console.log(res.data);
    //                 return res.data
    //                 }).catch(error => {
    //                     console.error('There was an error!', error);
    //                 })

    const community= await axios.get(baseUrl+'community', {params:{domain:'nectarit'}})
                    .then(res => {
                    // console.log(res);
                    // console.log(res.data);
                    return res.data
                    }).catch(error => {
                        console.error('There was an error!', error);
                    })   
                    
    const site = await axios.get(baseUrl+'site', {  })
                .then(res => {
                // console.log(res);
                // console.log(res.data);
                return res.data
                }).catch(error => {
                    console.error('There was an error!', error);
                })
    const deviceId = await axios.get(baseUrl+'device', {  })
                    .then(res => {
                    // console.log(res);
                    // console.log(res.data);
                    return res.data
                    }).catch(error => {
                        console.error('There was an error!', error);
                    })
    // console.log(client,subcommunity,community,site)

    const equipmentType = [{domain:'nectarit',equipName:'FanCoilUnit'},{domain:'nectarit',equipName:'BTUMeter'},{domain:'nectarit',equipName:'BoosterPump'},{domain:'nectarit',equipName:'DDCController'}]

    const pointsData = [{domain:'nectarit',equipName:'FanCoilUnit',point:'Run Status'},{domain:'nectarit',equipName:'BTUMeter',point:'Manual Occupancy'},{domain:'nectarit',equipName:'BoosterPump',point:'Return Temperature'},{domain:'nectarit',equipName:'DDCController',point:'Space Humidity'}]

    localStorage.setItem('api',JSON.stringify({client,community,site,deviceId,equipmentType,pointsData}))
    // return {client,subcommunity,community,site} 
    
    }

    
