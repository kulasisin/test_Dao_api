// 創建Socket.io客戶端連接
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
const socket = io("https://daotaiwanapi.onrender.com", {
  withCredentials: false,
});

// 當使用者點擊開燈按鈕時觸發
document
  .getElementById("light-on-button")
  .addEventListener("click", function () {
    const requestId = document.getElementById("light-id").value; // 取得 input id 的值
    fetchTextureById(requestId, "light-on");
  });

// 監聽後端發送的 light-on 訊號
socket.on("light-on", function (data) {
  console.log("伺服器收到開燈訊號:", data);
});

document
  .getElementById("light-off-button")
  .addEventListener("click", function () {
    const requestId = document.getElementById("light-id").value; // 取得 input id 的值
    fetchTextureById(requestId, "light-off");
    console.log("發送關燈訊號至伺服器");
  });

socket.on("light-off", function (data) {
  console.log("伺服器收到關燈訊號:", data);
});

function fetchTextureById(id, event) {
  fetch(`https://daotaiwanapi.onrender.com/image/${id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(`獲取${id}貼圖資料`, data.data.category);
      const category = data.data.category;
      socket.emit(`${event}`, { _id: id, category: category });
    })
    .catch((error) => console.error("貼圖資料獲取失敗:", error));
}
