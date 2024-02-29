var userAnswers = [];

function startQuiz() {
  // Ẩn form nhập thông tin và hiện form câu hỏi
  document.getElementById('userInfoForm').style.display = 'none';
  document.getElementById('quizForm').style.display = 'block';
}

function submitQuiz() {
  // Lấy thông tin người dùng
  var fullName = document.getElementById('fullName').value;

  // Lấy câu trả lời từ người dùng
  userAnswers = [];
  questions.forEach(function (q, index) {
    if (q.type === "trueFalse" || q.type === "multipleChoice") {
      var selectedOption = document.querySelector('input[name="question' + (index + 1) + '"]:checked');
      if (selectedOption) {
        userAnswers.push(selectedOption.value);
      } else {
        userAnswers.push("Không có câu trả lời");
      }
    } else if (q.type === "multipleSelect") {
      var selectedCheckboxes = document.querySelectorAll('input[name="question' + (index + 1) + '"]:checked');
      var selectedValues = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);
      if (selectedValues.length > 0) {
        userAnswers.push(selectedValues);
      } else {
        userAnswers.push("Không có câu trả lời");
      }
    } else if (q.type === "openEnded") {
      var openEndedAnswer = document.querySelector('textarea[name="question' + (index + 1) + '"]');
      if (openEndedAnswer) {
        userAnswers.push(openEndedAnswer.value);
      } else {
        userAnswers.push("Không có câu trả lời");
      }
    }
  });

  // Thực hiện xử lý và tính điểm
  var score = calculateScore();

  // Hiển thị kết quả
  displayResult(fullName, score);
}

function calculateScore() {
  // Thực hiện xử lý tính điểm ở đây
  var score = 0;

  questions.forEach(function (q, index) {
    var correctAnswer = q.answer;

    if (q.type === "multipleSelect") {
      // So sánh mảng câu trả lời của người dùng với mảng đáp án đúng
      if (arrayEquals(userAnswers[index], correctAnswer)) {
        score++;
      }
    } else {
      // So sánh câu trả lời của người dùng với đáp án đúng
      if (userAnswers[index] === correctAnswer) {
        score++;
      }
    }
  });

  return score;
}

// Hàm so sánh hai mảng
function arrayEquals(arr1, arr2) {
  return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
}

function displayResult(fullName, score) {
  // Hiển thị kết quả
  var resultDiv = document.getElementById('result');
  resultDiv.style.display = 'block';

  resultDiv.innerHTML = `<h2>Kết quả bài làm của ${fullName}</h2>`;
  resultDiv.innerHTML += `<p>Điểm của bạn: ${score}</p>`;
  resultDiv.innerHTML += '<h3>Câu trả lời của bạn:</h3>';

  userAnswers.forEach(function (answer, index) {
    var questionNumber = index + 1;
    resultDiv.innerHTML += `<p>Câu hỏi ${questionNumber}: ${answer}</p>`;
  });

  resultDiv.innerHTML += `<p>Xếp loại: ${getGrade(score)}</p>`;
}

function getGrade(score) {
  // Định nghĩa các khoảng điểm và xếp loại tương ứng
  if (score >= 8) {
    return 'Xuất sắc';
  } else if (score >= 6) {
    return 'Khá';
  } else if (score >= 4) {
    return 'Trung bình';
  } else {
    return 'Yếu kém';
  }
}

// Các câu hỏi
var questions = [
  { type: "trueFalse", question: "Câu hỏi 1: Hôm nay là thứ 5?", answer: true },
  // Thêm 4 câu hỏi khác tương tự ở đây
  { type: "multipleChoice", question: "Câu hỏi 2: Chọn đáp án đúng.", options: ["A", "B", "C", "D"], answer: "A" },
  // Thêm 4 câu hỏi khác tương tự ở đây
  { type: "multipleSelect", question: "Câu hỏi 3: Chọn các đáp án đúng.", options: ["A", "B", "C", "D"], answer: ["A", "C"] },
  // Thêm 4 câu hỏi khác tương tự ở đây
  { type: "openEnded", question: "Câu hỏi 4: Viết câu trả lời của bạn vào đây." },
  // Thêm 4 câu hỏi khác tương tự ở đây
];

// Gọi hàm để tạo câu hỏi khi trang được tải
window.onload = createQuestions;

function createQuestions() {
  var form = document.getElementById("quizForm");

  questions.forEach(function (q, index) {
    var questionDiv = document.createElement("div");
    questionDiv.classList.add("question-group");

    var questionHeading = document.createElement("h2");
    questionHeading.textContent = q.question;
    questionDiv.appendChild(questionHeading);

    if (q.type === "trueFalse") {
      var trueFalseOptions = ["Đúng", "Sai"];
      trueFalseOptions.forEach(function (option) {
        var label = document.createElement("label");
        var radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "question" + (index + 1);
        radio.value = option;
        label.appendChild(radio);
        label.appendChild(document.createTextNode(option));
        questionDiv.appendChild(label);
      });
    } else if (q.type === "multipleChoice") {
      q.options.forEach(function (option) {
        var label = document.createElement("label");
        var radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "question" + (index + 1);
        radio.value = option;
        label.appendChild(radio);
        label.appendChild(document.createTextNode(option));
        questionDiv.appendChild(label);
      });
    } else if (q.type === "multipleSelect") {
      q.options.forEach(function (option) {
        var label = document.createElement("label");
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "question" + (index + 1);
        checkbox.value = option;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(option));
        questionDiv.appendChild(label);
      });
    } else if (q.type === "openEnded") {
      var textarea = document.createElement("textarea");
      textarea.name = "question" + (index + 1);
      textarea.rows = 4;
      questionDiv.appendChild(textarea);
    }

    form.appendChild(questionDiv);
  });
}
