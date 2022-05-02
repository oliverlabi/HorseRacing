import { useEffect, useState, useContext } from "react";
import { Context } from "../store";
import { updateRace } from "../store/actions";
import BackendUrl from "../components/BackendUrl";
import ErrorMessage from "../components/ErrorMessage";
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
      }, [])

    let rows;
    if(state.races.data !== undefined){
        const iteratedData = state.races.data.map(row => ({
            key: row._id,
            raceName: row.raceName,
            raceDescription: row.raceDescription,
            raceTrack: ConvertTrackName(row.raceTrack),
            startingTime: moment(row.startingTime).format('DD/MM/YY HH:mm'),
            participatingHorses: row.participatingHorses,
            horseColors: row.horseColors,
            winningHorse: row.winningHorse,
            createdBy: row.createdBy
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
          key: 'raceName',
        },
        {
          title: 'Description',
          dataIndex: 'raceDescription',
          key: 'raceDescription',
        },
        {
          title: 'Track',
          dataIndex: 'raceTrack',
          key: 'raceTrack',
        },
        {
          title: 'Participating horses',
          key: 'participatingHorses',
          dataIndex: 'participatingHorses',
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
            render(horse){
                if(horse == undefined){
                    return 'No result!'
                } else {
                    return horse
                }
            }
        },
        {
            title: 'Creator',
            key: 'createdBy',
            dataIndex: 'createdBy',
        },
        {
            title: 'Starting time',
            key: 'startingTime',
            dataIndex: 'startingTime',
        },
      ];
    
    return (
        <div>
            <h1>Results</h1>
            <Table columns={columns} dataSource={rows} size='small' pagination={{pageSize: 6}} />
        </div>
        
    );

}

export default ResultsPage