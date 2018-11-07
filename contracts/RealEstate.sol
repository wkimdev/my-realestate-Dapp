pragma solidity ^0.4.23;

contract RealEstate {
    // 생성자
    // class 멤버 변수 초기화
    // 배포할때 단 한번만 생성하고 끝난다. 그 이후로 호출 못한다. 
    // 배포할때 계정 = 컨트랙트 소유자
    address public owner;

    constructor() public {
        owner = msg.sender; // 현재 생성한 계정값.(주소형), 이 컨트랙의 주인은 현재 배포 계정이다. 라는 뜻.
    }

}
