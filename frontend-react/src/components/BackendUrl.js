var URI;

if(process.env.NODE_ENV === "production"){
    URI = 'https://horseracing-backend-ol.herokuapp.com/';
} else {
    URI = 'http://localhost:8000/';
}

const BackendUrl = URI;

export default BackendUrl;