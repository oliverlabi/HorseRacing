function ConvertTrackName(raceTrack){
    switch(raceTrack){
        case '500m-g':
            return('Gravel 500m');
        case '1000m-g':
            return('Gravel 1km');
        case '500m-a':
            return('Asphalt 500m');
        case '1000m-a':
            return('Asphalt 1km');
        default:
            return('Track reading error!')
    }   
}

export default ConvertTrackName;