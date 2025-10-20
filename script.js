// 전역 변수: 현재 선택된 타입 (1on1 또는 2on2)과 단과대학-학과 데이터
let currentMatchType = '';
let tempParticipantData = null; // 제출할 데이터를 임시 저장할 변수
const dataStorage = {
    '1on1': [], // 1:1 참가자 데이터 배열
    '2on2': []  // 2:2 참가자 데이터 배열
};
const departmentData = {
    '간호대학': ['간호학과'],
    '경상대학': ['경영학부', '경제학과', '무역학과', '아시아비즈니스국제학과'],
    '공과대학': ['건축공학과', '건축학과', '기계공학부', '메카트로닉스공학과', '선박해양공학과', '신소재공학과', '에너지공학과', '응용화학공학과', '유기재료공학과', '인공지능학과', '자율운항시스템공학과', '전기공학과', '전자공학과', '전파정보통신공학과', '정보통신융합학부', '컴퓨터융합학부', '토목공학과', '항공우주공학과', '환경공학과'],
    '국가안보융합학부': ['국토안보학전공', '해양안보학전공'],
    '국제학부': ['국제학부'],
    // ✨ 농업생명과학대학 학과 목록 수정 (농업생명융합학부 추가 및 가나다순 정렬)
    '농업생명과학대학': ['농업경제학과', '농업생명융합학부', '동물바이오시스템과학과', '동물자원생명과학과', '산림환경자연학과', '생물환경화학과', '스마트농업시스템기계공학과', '식물자원학과', '식품공학과', '원예학과', '응용생물학과', '지역환경토목학과', '환경소재공학과'],
    '사범대학': ['건설공학교육과', '교육학과', '국어교육과', '기계공학교육과', '기술교육과', '수학교육과', '영어교육과', '전기·전자·통신공학교육과', '체육교육과', '화학공학교육과'],
    '사회과학대학': ['도시·자치융합학과', '문헌정보학과', '사회복지학과', '사회학과', '심리학과', '언론정보학과', '정치외교학과', '행정학부'],
    '생활과학대학': ['소비자학과', '식품영양학과', '의류학과'],
    '생명시스템과학대학': ['미생물·분자생명과학과', '생명정보융합학과', '생물과학과'],
    '수의과대학': ['수의학과(수의예과)'],
    '약학대학': ['약학과'],
    '예술대학': ['관현악과', '디자인창의학과', '음악과', '조소과', '회화과'],
    '의과대학': ['의학과(의예과)'],
    '인문대학': ['고고학과', '국사학과', '국어국문학과', '독어독문학과', '불어불문학과', '사학과', '언어학과', '영어영문학과', '일어일문학과', '중어중문학과', '철학과', '한문학과'],
    '자연과학대학': ['무용학과', '물리학과', '반도체융합학과', '생화학과', '스포츠과학과', '수학과', '정보통계학과', '지질환경과학과', '천문우주과학과', '해양환경과학과', '화학과'],
    '지식융합학부': ['공공안전학과', '리더쉽과 조직과학과', '인문사회학과'],
    '창의융합대학': ['창의융합대학'],
    '': ['단과대학을 먼저 선택하세요']
};


/**
 * 페이지 전환 함수
 */
function showPage(pageNum, matchType = '') {
    if (matchType) {
        currentMatchType = matchType;
    }

    const adminPage = document.getElementById('adminPage');
    if (adminPage && adminPage.classList.contains('active')) {
        document.getElementById('downloadArea').style.display = 'none';
        document.getElementById('adminPassword').value = '';
    }

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    let targetId = '';
    if (pageNum === 4 && currentMatchType === '1on1') { targetId = 'page4_1on1'; }
    else if (pageNum === 5 && currentMatchType === '2on2') { targetId = 'page5_2on2'; }
    else if (pageNum === 7) { targetId = 'adminPage'; }
    else { targetId = 'page' + pageNum; }

    const targetPage = document.getElementById(targetId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0);
    } else {
        console.error("존재하지 않는 페이지 ID:", targetId);
        alert(`페이지 이동 오류: ID "${targetId}"를 찾을 수 없습니다. HTML을 확인해주세요.`);
    }
}

/** 메인 페이지에서 참가비 팝업 플로우를 시작 */
function startParticipationFlow(matchType) {
    currentMatchType = matchType; // 매치 타입 저장
    const popup = document.getElementById('paymentPopupOverlay'); // 참가비 팝업 먼저
    if (popup) popup.style.display = 'flex';
}

/** 참가비 팝업 확인 후 개인정보 동의 페이지로 이동 */
function proceedToConsent() {
    closePopup('paymentPopupOverlay'); // 참가비 팝업 닫기
    showPage(2); // page2로 이동
}


// 관리자 버튼 클릭 시 호출되는 함수
function showAdminPage() {
    showPage(7);
}

// 초기 로드 시 페이지 1 활성화 및 로컬 스토리지 데이터 로드
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('page1').classList.add('active');

    const stored1on1 = localStorage.getItem('data_1on1');
    const stored2on2 = localStorage.getItem('data_2on2');
    if (stored1on1) dataStorage['1on1'] = JSON.parse(stored1on1);
    if (stored2on2) dataStorage['2on2'] = JSON.parse(stored2on2);
});

// --- 2. 개인정보 수집 동의 페이지 (page 2) 기능 ---
function checkConsentAndProceed() {
    const consentChecked = document.getElementById('consent1').checked;
    if (consentChecked) {
        showPage(3);
    }
    else {
        alert("개인정보 수집 및 이용에 동의해야 다음 단계로 진행할 수 있습니다.");
    }
}


// --- 3. 매칭 이후 책임 동의 페이지 (page 3) 기능 ---
function checkResponsibilityConsent() {
    const consentChecked = document.getElementById('consent2').checked;
    if (consentChecked) {
        const popup = document.getElementById('refundPopupOverlay');
        if (popup) popup.style.display = 'flex';
    }
    else {
        alert("매칭 이후 책임 동의에 동의해야 다음 단계로 진행할 수 있습니다.");
    }
}

function showMatchingLogicPopup() {
    closePopup('refundPopupOverlay');
    const popup = document.getElementById('matchingLogicPopupOverlay');
    if (popup) popup.style.display = 'flex';
}

function finalConfirmAndProceed() {
    closePopup('matchingLogicPopupOverlay');

    if (currentMatchType === '1on1') {
        showPage(4);
    }
    else if (currentMatchType === '2on2') {
        showPage(5);
    } else {
        alert("매칭 타입을 다시 선택해주세요.");
        showPage(1);
    }
}

// 특정 ID를 가진 팝업을 닫습니다.
function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = 'none';
    }
}


// --- 4/5. 단과대학-학과 드롭다운 연동 기능 ---
function updateDepartments(collegeId, deptId) {
    const collegeSelect = document.getElementById(collegeId);
    const deptSelect = document.getElementById(deptId);
    const selectedCollege = collegeSelect.value;

    deptSelect.innerHTML = '';

    const placeholder = document.createElement('option');
    placeholder.value = "";
    deptSelect.appendChild(placeholder);

    if (selectedCollege) {
        placeholder.textContent = "학과를 선택하세요";

        const departments = departmentData[selectedCollege] || [];
        // '창의융합대학'은 학과 목록이 하나뿐이고 이름이 같으므로 예외 처리 필요 없음
        if (departments.length > 0) {
             departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept;
                option.textContent = dept;
                deptSelect.appendChild(option);
            });
             deptSelect.disabled = false;
        } else {
             // 학과 목록이 없는 경우 (이론상 없어야 함)
             placeholder.textContent = "-";
             deptSelect.value = "-";
             deptSelect.disabled = true;
        }

    } else {
        placeholder.textContent = "단과대학을 먼저 선택하세요";
        deptSelect.disabled = true;
    }
}


// --- 4/5. 폼 제출 및 최종 확인 기능 ---
function submitForm(type, event) {
    event.preventDefault();

    const formId = (type === '1on1') ? 'form1on1' : 'form2on2';
    const form = document.getElementById(formId);

    if (!form.checkValidity()) {
        alert("모든 필수 항목을 올바르게 입력해주세요.");
        return;
    }

    let participantData = {
        '매칭타입': type,
        '개인정보수집_동의': document.getElementById('consent1').checked ? 'Y' : 'N',
        '매칭책임_동의': document.getElementById('consent2').checked ? 'Y' : 'N',
        '제출시간': new Date().toLocaleString()
    };

    let htmlContent = '';

    if (type === '1on1') {
        participantData = {
            ...participantData,
            '복권번호': document.getElementById('lotteryNum1').value,
            '참가자_단과대학': document.getElementById('college1').value,
            '참가자_학과': document.getElementById('dept1').value || '-', // 학과 없으면 '-' 표시
            '참가자_학번': document.getElementById('studentId1').value,
            '참가자_이름': document.getElementById('name1').value,
            '참가자_성별': document.querySelector('input[name="gender"]:checked') ? document.querySelector('input[name="gender"]:checked').value : 'N/A',
            '참가자_전화번호': document.getElementById('phone1').value,
        };
        htmlContent = `
            <p><strong>복권 번호:</strong> ${participantData.복권번호}</p>
            <p><strong>단과대학:</strong> ${participantData.참가자_단과대학}</p>
            <p><strong>학과:</strong> ${participantData.참가자_학과}</p>
            <p><strong>학번:</strong> ${participantData.참가자_학번}</p>
            <p><strong>이름:</strong> ${participantData.참가자_이름}</p>
            <p><strong>전화번호:</strong> ${participantData.참가자_전화번호}</p>
        `;
    } else { // 2on2
         participantData = {
            ...participantData,
            '복권번호': document.getElementById('lotteryNum2').value,
            '참가팀_성별': document.querySelector('input[name="gender2"]:checked') ? document.querySelector('input[name="gender2"]:checked').value : 'N/A',
            '참가자_1_단과대학': document.getElementById('2-1_college').value,
            '참가자_1_학과': document.getElementById('2-1_dept').value || '-',
            '참가자_1_학번': document.getElementById('2-1_studentId').value,
            '참가자_1_이름': document.getElementById('2-1_name').value,
            '참가자_1_전화번호': document.getElementById('2-1_phone').value,
            '참가자_2_단과대학': document.getElementById('2-2_college').value,
            '참가자_2_학과': document.getElementById('2-2_dept').value || '-',
            '참가자_2_학번': document.getElementById('2-2_studentId').value,
            '참가자_2_이름': document.getElementById('2-2_name').value,
            '참가자_2_전화번호': document.getElementById('2-2_phone').value
        };
        htmlContent = `
            <p><strong>복권 번호:</strong> ${participantData.복권번호}</p>
            <h4>참가자 1</h4>
            <p><strong>단과대학:</strong> ${participantData.참가자_1_단과대학}</p>
            <p><strong>학과:</strong> ${participantData.참가자_1_학과}</p>
            <p><strong>학번:</strong> ${participantData.참가자_1_학번}</p>
            <p><strong>이름:</strong> ${participantData.참가자_1_이름}</p>
            <p><strong>전화번호:</strong> ${participantData.참가자_1_전화번호}</p>
            <h4>참가자 2</h4>
            <p><strong>단과대학:</strong> ${participantData.참가자_2_단과대학}</p>
            <p><strong>학과:</strong> ${participantData.참가자_2_학과}</p>
            <p><strong>학번:</strong> ${participantData.참가자_2_학번}</p>
            <p><strong>이름:</strong> ${participantData.참가자_2_이름}</p>
            <p><strong>전화번호:</strong> ${participantData.참가자_2_전화번호}</p>
        `;
    }

    tempParticipantData = participantData;
    document.getElementById('confirmation-details').innerHTML = htmlContent;
    const popup = document.getElementById('finalConfirmPopupOverlay');
    if(popup) popup.style.display = 'flex';
}

// 최종 확인 후 데이터를 저장하고 완료 페이지로 이동
function processFinalSubmission() {
    if (!tempParticipantData) return;

    const type = tempParticipantData.매칭타입;
    dataStorage[type].push(tempParticipantData);
    localStorage.setItem(`data_${type}`, JSON.stringify(dataStorage[type]));

    showPage(6);

    // 폼 초기화
    const formId = (type === '1on1') ? 'form1on1' : 'form2on2';
    const form = document.getElementById(formId);
    if(form) form.reset();

    // 동의 체크박스 초기화
    const consent1 = document.getElementById('consent1');
    const consent2 = document.getElementById('consent2');
    if (consent1) consent1.checked = false;
    if (consent2) consent2.checked = false;

    // 임시 데이터 초기화 및 팝업 닫기
    tempParticipantData = null;
    closePopup('finalConfirmPopupOverlay');
}

// --- 7. 관리자 페이지 및 엑셀 다운로드 기능 ---
function checkAdminPassword() {
    const password = document.getElementById('adminPassword').value;
    const downloadArea = document.getElementById('downloadArea');

    if (password === '5656') {
        downloadArea.style.display = 'block';
    } else {
        alert("비밀번호가 틀렸습니다.");
        downloadArea.style.display = 'none';
    }
}

function downloadData(type) {
    const data = dataStorage[type];
    if (data.length === 0) { alert(`${type} 데이터가 없습니다.`); return; }

    const headers = Object.keys(data[0]);
    let csvContent = headers.join(',') + '\n';

    const forceTextHeaders = [
        '복권번호',
        '참가자_학번', '참가자_1_학번', '참가자_2_학번',
        '참가자_전화번호', '참가자_1_전화번호', '참가자_2_전화번호'
    ];

    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];

            if (forceTextHeaders.includes(header)) {
                return `=" ${value}"`;
            }
            const escapedValue = String(value).replace(/"/g, '""');
            return `"${escapedValue}"`;
        });
        csvContent += values.join(',') + '\n';
    });


    let filename = (type === '1on1') ? '복권소개팅 1대1 데이터.csv' : '복권소개팅 2대2 데이터.csv';
    const blob = new Blob(["\ufeff", csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`"${link.download}" 파일 다운로드가 시작됩니다.`);
}

function confirmResetData() {
    const isConfirmed = confirm("정말 모든 데이터를 초기화하시겠습니까?\n이 작업은 복구할 수 없습니다!");
    if (isConfirmed) {
        const passwordCheck = prompt("데이터 초기화를 진행하려면 관리자 비밀번호를 입력하세요:");
        if (passwordCheck === '5656') {
            resetData();
        } else if (passwordCheck !== null) {
            alert("비밀번호가 틀렸습니다.");
        } else {
            alert("데이터 초기화를 취소하였습니다.");
        }
    }
}

function resetData() {
    dataStorage['1on1'] = [];
    dataStorage['2on2'] = [];
    localStorage.removeItem('data_1on1');
    localStorage.removeItem('data_2on2');
    alert("✅ 모든 참가 데이터가 초기화되었습니다.");
    document.getElementById('downloadArea').style.display = 'none';
    document.getElementById('adminPassword').value = '';
}


// ✨ 반짝이는 별 배경 생성 스크립트 ✨
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const starCount = 250;

    for (let i = 0; i < starCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        const size = Math.random() * 2 + 1;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.top = `${Math.random() * 100}%`;
        dot.style.left = `${Math.random() * 100}%`;
        dot.style.animationDelay = `${Math.random() * 2}s`;
        body.appendChild(dot);
    }
});

// 입력값에서 숫자만 남기고 나머지는 제거합니다.
function filterNonNumeric(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
}

// 학번 입력 필터링 함수 (숫자 및 대문자 영어)
function filterStudentId(event) {
    event.target.value = event.target.value.replace(/[^A-Z0-9]/g, '');
}