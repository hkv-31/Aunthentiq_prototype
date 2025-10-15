import axios from "axios";

axios.get("http://127.0.0.1:5000/api/returns")
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
