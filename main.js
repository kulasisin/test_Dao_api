// 初始加载图片列表
fetchImages();
fetchProcessedImages();

//上傳圖片
const uploadTextureButton = document.getElementById("uploadTexure");
uploadTextureButton.addEventListener("click", () => uploadImage());
//選染圖片上傳
const uploadResultButton = document.getElementById("uploadResult");
uploadResultButton.addEventListener("click", () => fetchProcessedImages());
// 獲取圖片列表函數
function fetchImages() {
  const xhr = new XMLHttpRequest();
  // xhr.open("GET", "https://daotaiwanapi.onrender.com/images");

  xhr.open("GET", "https://daotaiwanapi.onrender.com/images");
  xhr.onload = function () {
    if (xhr.status === 200) {
      const images = JSON.parse(xhr.responseText).data.slice(-30);
      const imageList = document.getElementById("imageList");
      imageList.innerHTML = ""; // 清空先前的列表

      const ul = document.createElement("ul"); // 創建 ul 元素

      images.reverse().forEach((image) => {
        const li = document.createElement("li"); // 創建 li 元素
        const img = document.createElement("img");
        img.src = image.url; // 使用 URL
        img.alt = image.filename;

        // 创建删除按钮
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "删除";
        deleteButton.addEventListener("click", () => deleteImage(image._id));



        // 创建开灯按钮
        const lightOnButton = document.createElement("button");
        lightOnButton.textContent = "開燈測試";
        lightOnButton.addEventListener("click", () =>
          fetchTextureById(image._id, image.category, "light-on")
        );

        // 创建关灯按钮
        const lightOffButton = document.createElement("button");
        lightOffButton.textContent = "關燈測試";
        lightOffButton.addEventListener("click", () =>
          fetchTextureById(image._id, image.category, "light-off")
        );

        // 创建显示 _id 的输入框
        const idInput = document.createElement("input");
        idInput.type = "text";
        idInput.value = image._id;
        idInput.readOnly = true;
        // 创建显示 _id 的输入框
        const typeInput = document.createElement("input");
        typeInput.type = "text";
        typeInput.value = image.category;
        typeInput.readOnly = true;
        li.appendChild(img); // 把 img 放到 li 中
        li.appendChild(lightOnButton);
        li.appendChild(lightOffButton);
        li.appendChild(idInput);
        li.appendChild(typeInput);
        li.appendChild(deleteButton);

        ul.appendChild(li); // 把 li 放到 ul 中
      });
      imageList.appendChild(ul); // 把 ul 放到 imageList 中
    } else {
      console.error("獲取圖片列表失敗");
    }
  };
  xhr.send();
}
// 新增渲染成果圖片列表
function createProcessedList() {
  const list = document.createElement("ul");
  list.id = "processedImageList";
  document.body.appendChild(list);
  return list;
}
//獲取渲染成果圖
function fetchProcessedImages() {
  fetch("https://daotaiwanapi.onrender.com/results")
    .then((response) => response.json())
    .then((data) => {
      const processedImageList = document.getElementById("processedImageList");
      processedImageList.innerHTML = "";
      const ul = document.createElement("ul");

      data.data.slice(-30).reverse().forEach((image) => {
        const li = document.createElement("li");
        const img = document.createElement("img");
        img.src = image.url;
        img.alt = image.filename;
        li.appendChild(img);
        ul.appendChild(li);
      });
      processedImageList.appendChild(ul);
    })
    .catch((error) =>
      console.error("Failed to fetch processed images:", error)
    );
}
function uploadImage() {
  const formData = new FormData(document.getElementById("uploadForm"));

  console.log(formData);
  fetch("https://daotaiwanapi.onrender.com/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      alert(JSON.stringify(data.message));
      fetchImages(); // 重新加载图片列表
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to upload image");
    });
}

// 删除貼圖的函数
function deleteImage(imageId) {
  fetch(`https://daotaiwanapi.onrender.com/image/delete/${imageId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        alert("貼圖删除成功");
        fetchImages(); // 重新加载图片列表
      } else {
        alert("貼圖删除失敗");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("貼圖删除失敗");
    });
}
// 創建Socket.io客戶端連接
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
const socket = io("https://daotaiwanapi.onrender.com", {
  withCredentials: false,
});
// 監聽後端發送的 message 訊號
socket.on("message", function (data) {
  console.log("伺服器傳送訊息:", data);
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


function fetchTextureById(id, type, event) {
  try {
    socket.emit(`${event}`, { _id: id, category: type });
  } catch (error) {
    console.error("貼圖資料獲取失敗:", error);
  }
}
