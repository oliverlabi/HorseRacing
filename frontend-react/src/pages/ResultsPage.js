import { useEffect, useState, useContext } from "react";
import { Context } from "../store";
import { updateRace } from "../store/actions";
import BackendUrl from "../components/BackendUrl";
import ErrorMessage from "../components/messages/ErrorMessage";
import { Table } from "antd";
import moment from "moment";
import ConvertTrackName from "../components/ConvertTrackName";

const ResultsPage = () => {
    const [state, dispatch] = useContext(Context);

    useEffect(() => {
        fetch(BackendUrl + 'api/race/all')
        .then(response => {
          if(response.ok){
            return response.json();
          } else {
            throw new Error("Error fetching races!");
          }
        })
        .then(data => {
          dispatch(updateRace(data));
        })
        .catch(error => {
          ErrorMessage(error);
        });
      }, [state.auth])

    const userBets = (row, index, option) => {
      if(state.auth.bets != undefined && state.auth.bets.some(el => el.raceID == row.raceID)){
        const betIndex = state.auth.bets.findIndex(e => e.raceID == row.raceID);
        if(option == 0){
          return state.auth.bets[betIndex].horse;
        } else if (option == 1){
          return state.auth.bets[betIndex].horse;
        } else if (option == 2){
          return state.auth.bets[betIndex].amount + ' c';
        }
      } else {
        return "No bet";
      }
    }

    let rows;
    if(state.races.data !== undefined){
        const iteratedData = state.races.data.map((row, index) => ({
            status: userBets(row, index, 0),
            key: row._id,
            raceName: row.raceName,
            raceDescription: row.raceDescription,
            raceTrack: ConvertTrackName(row.raceTrack),
            startingTime: moment(row.startingTime).format('DD/MM/YY HH:mm'),
            participatingHorses: row.participatingHorses,
            horseColors: row.horseColors,
            winningHorse: row.winningHorse,
            createdBy: row.createdBy,
            userHorse: userBets(row, index, 1),
            userBet: userBets(row, index, 2)
        }))
    
        rows = [
        ...iteratedData
        ];
    } else {
        rows = []
    }

    const columns = [
        {
          title: 'Name',
          dataIndex: 'raceName',
          width: 75,
          key: 'raceName',
          fixed: 'left',
          render(name){
            return(<p>{name}</p>)
          }
        },
        
        {
          title: 'Status',
          dataIndex: 'status',
          width: 75,
          key: 'status',
          render(horse, index){
            if(horse == index.winningHorse){
              return(<p style={{color: 'Green'}} text='won' >Won</p>)
            } else if (horse == "No bet"){
              return(<p style={{color: 'Black'}}>No bet!</p>)
            } else if (index.winningHorse == undefined){
              return(<p style={{color: 'Orange'}}>Ongoing</p>)
            } else {
              return(<p style={{color: 'Red'}}>Lost</p>)
            }
          }
        },
        {
          title: 'Description',
          dataIndex: 'raceDescription',
          width: 100,
          key: 'raceDescription',
          render(desc){
            return(<p>{desc}</p>)
          }
        },
        {
          title: 'Track',
          dataIndex: 'raceTrack',
          key: 'raceTrack',
          width: 75,
          render(track){
            return(<p>{track}</p>)
          }
        },
        {
          title: 'Participating horses',
          key: 'participatingHorses',
          dataIndex: 'participatingHorses',
          width: 100,
          render(horse, index) {
            let horseHTML = [];
            for(var i=0; i<horse.length; i++){
              horseHTML.push(<p key={horse[i]} style={{ color: index.horseColors[i], margin: 0}}>{horse[i]}</p>);
            }
            return (
              <>
              {horseHTML}
              </>
            );
          }
        },
        {
          title: 'Winner',
          key: 'winningHorse',
          dataIndex: 'winningHorse',
          width: 65,
          render(horse){
            if(horse == undefined){
                return <p>No results yet!</p>
            } else {
                return <p>{horse}</p>
            }
          }
        },
        {
          title: 'Your horse',
          key: 'userHorse',
          width: 65,
          dataIndex: 'userHorse',
          render(horse, index){
            if(horse == index.winningHorse){
              return(<p>{horse}</p>)
            } else if (horse == "No bet"){
              return(<p>No bet!</p>)
            } else if (index.winningHorse == undefined){
              return(<p>{horse}</p>)
            } else {
              return(<p>{horse}</p>)
            }
          }
        },
        {
          title: 'Bet amount',
          key: 'userBet',
          width: 70,
          dataIndex: 'userBet',
          render(horse, index){
            if(horse == index.winningHorse){
              return(<p>{horse}</p>)
            } else if (horse == "No bet"){
              return(<p>No bet!</p>)
            } else if (index.winningHorse == undefined){
              return(<p>{horse}</p>)
            } else {
              return(<p>{horse}</p>)
            }
          }
        },
        {
          title: 'Creator',
          key: 'createdBy',
          dataIndex: 'createdBy',
          width: 70,
          render(createdBy){
            return(<p>{createdBy}</p>)
          }
        },
        {
          title: 'Starting time',
          key: 'startingTime',
          dataIndex: 'startingTime',
          defaultSortOrder: 'descend',
          width: 75,
          fixed: 'right',
          sorter: (a, b) => moment(a.startingTime) - moment(b.startingTime),
          render(time){
            return(<p>{time}</p>)
          }
        },
      ];
    
    return (
        <div>
            <h1>Results</h1>
            <Table columns={columns} dataSource={rows} size='small' pagination={{pageSize: 3}} scroll={{x: 500, y: 400}} style={{minWidth: '250px', maxWidth: '600px', width: '60vw'}} showSorterTooltip={false}/>
        </div>
        
    );

}

export default ResultsPage;