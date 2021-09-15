import axios from 'axios'


// const baseUrl = "http://localhost:8081/api/"
const baseUrl = "https://onboard-validator.herokuapp.com/api/"
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

    const token = await axios.get('http://localhost:8081/api', {  })
                    .then(res => {
                    // console.log(res);
                    // console.log(res.data);
                    return res.data
                    }).catch(error => {
                        console.error('There was an error!', error);
                    })
                    
//    const client = await axios.get(baseUrl+'client', {  })
//                     .then(res => {
//                     // console.log(res);
//                     // console.log(res.data);
//                     return res.data
//                     }).catch(error => {
//                         console.error('There was an error!', error);
//                     })
    const client = ['nectarit','netix']
    // console.log('clientLenght'+client.length);
    // const subcommunity = await axios.get(baseUrl+'subcommunity', {  })
    //                 .then(res => {
    //                 // console.log(res);
    //                 // console.log(res.data);
    //                 return res.data
    //                 }).catch(error => {
    //                     console.error('There was an error!', error);
    //                 })
     var community = [];
    for(let i=0;i<client.length;i++){
        community = community.concat( await axios.get(baseUrl+'community', {params:{domain:client[i]}})
                        .then(res => {
                        // console.log(res);
                        // console.log(res.data);
                        return res.data
                        }).catch(error => {
                            console.error('There was an error!', error);
                    })   
                )
                }
    var site = [];
    for(let i=0;i<client.length;i++){
    site = site.concat( await axios.get(baseUrl+'site', { params:{domain:client[i]} })
                .then(res => {
                // console.log(res);
                // console.log(res.data);
                return res.data
                }).catch(error => {
                    console.error('There was an error!', error);
                })
            )
            }
    var deviceId = [];
    for(let i=0;i<client.length;i++){
     deviceId =  deviceId.concat( await axios.get(baseUrl+'device', { params:{domain:client[i]} })
                    .then(res => {
                    // console.log(res);
                    // console.log(res.data);
                    return res.data
                    }).catch(error => {
                        console.error('There was an error!', error);
                    })
                )
                }
    var pointData = [];
    var equipmentType = [];
    var pointsData = [];
    for(let i=0;i<client.length;i++){
        pointData = await axios.get(baseUrl+'point', { params:{domain:client[i]} })
                        .then(res => {
                        // console.log(res);
                        // console.log(res.data);
                        return res.data
                        }).catch(error => {
                            console.error('There was an error!', error);
                        })
                equipmentType = equipmentType.concat( pointData.map(item =>({equipName:item.templateName,domain:client[i]})) )
                pointsData = pointsData.concat( pointData.map(item =>({equipName:item.templateName,domain:client[i],point:item.configPoints.map(e=>e.data.pointId)})))
                    }
    // console.log(client,subcommunity,community,site,)

    // const equipmentType = pointData.map(item =>({equipName:item.templateName,domain:'nectarit'}))
    
    // const pointsData = pointData.map(item =>({equipName:item.templateName,domain:'nectarit',point:item.configPoints.map(e=>e.data.pointId)}))
    // const equipmentType = [{domain:'nectarit',equipName:'FanCoilUnit'},{domain:'nectarit',equipName:'BTUMeter'},{domain:'nectarit',equipName:'BoosterPump'},{domain:'nectarit',equipName:'DDCController'}]

    // const pointsData = [{domain:'nectarit',equipName:'FanCoilUnit',point:['Run Status',"BMS Schedule Enable"]},{domain:'nectarit',equipName:'BTUMeter',point:['Run Status',"BMS Schedule Enable",'Manual Occupancy']},{domain:'nectarit',equipName:'BoosterPump',point:['Run Status',"BMS Schedule Enable",'Manual Occupancy']},{domain:'nectarit',equipName:'DDCController',point:['Run Status',"BMS Schedule Enable",'Manual Occupancy']}]

    localStorage.setItem('api',JSON.stringify({client,community,site,deviceId,equipmentType,pointsData}))
    // return {client,subcommunity,community,site} 
    
    }

    
