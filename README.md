# my-realestate-Dapp
## simple real-estate Dapp (solidity)
- 출처 : 인프런(블록체인 이더리움 부동산 댑(Dapp) 만들기 – 기본편)
- Dapp의 프론트엔드부터 서버까지의 동작과정을 이해하기 위한 심플한 부동한 dApp 구현 Tutorial 진행
- ganache, truffle framework를 사용해 solidity와 프론트엔드(jquery), metamask를 연동하여 화면에서 부동산 매입후 매입한 계정정보를 이벤트 메시징 하는 부분까지 구현.  


# Tech Stack
- metamask private network
- solidiy
- truffle : smartcontract 배포 및 테스트를 위해 사용(framework) - 빌드환경 구성을 위한 사용.
- ganache : truffle에서 사용하는 이더리움 Client
- npm
- jQurey

# 구현 화면
- ![frontend_image](/file/frontend.png)

## info
#### migrations 폴더내 의미
- 1_initial_migration.js
- 2_deploy_contracts.. --> 앞의 숫자 의미는 배포 순서를 의미한다.(마이그레이션 배포 순서) 

## truffle?
- truffle.js : 환경 설정 담당. 어느 네트워크에 배포할지 설정함.
- truffle-config.js 위의 파일과 같은 기능.(cmd에서 truffle.js를 실행할때 충돌났을 경우를 위해 있는 파일. 파워쉘에서 쓰면 문제 없다. 삭제해도 됨.)

#### truffle 실행하기
1. $ cd my-real-estate
2. $ truffle develop (rpc endpoint가 아래를 가리킨다. )
   ==> Connected to existing Truffle Develop session at http://127.0.0.1:9545/   

- (커넥팅 하는것과 로그보는 것 두개를 띄운다.)
3. 터미널창을 또 띄워서 같은 경로에서 $ truffle develop --log 실행.
4. 아래와 같이 migrate 하면 생성된다.  --> 또 호출하면 스킵하게 된다. (이미 생성된 기존 컨트랙을 또 생성하지 않기 위한 장치)
- 한번 생성한 컨트랙은 다시 배포하지 못한다. (블럭체인은 삭제 불가)
- 그래서 테스트를 많이 하고 재배포를 하지 않도록 유의한다.   
  
```  

truffle(develop)> migrate
Using network 'develop'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0xbb8f907302a3ab5564e87cf7eaae4761e64e67a841871d62367f6649a0a75af2
  Migrations: 0x8cdaf0cd259887258bc13a92c0a6da92698644c0
Saving successful migration to network...
  ... 0xd7bc86d31bee32fa3988f1c1eabce403a1b5d570340a3a9cdba53a472ee8c956
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying RealEstate...
  ... 0xc8bc4195ce699774a6e14bccc12463f38c656131852e069cdc91e332360c6fb4
  RealEstate: 0x345ca3e014aaf5dca488057592ee47305d9b3e10
Saving successful migration to network...
  ... 0xf36163615f41ef7ed8f4a8f192149a0bf633fe1a2398ce001bf44c43dc7bdda0
Saving artifacts...
```  

#### 컨트랙 재배포
5. truffle(develop)> migrate --compile-all --reset
6. contract 아래에 artifacts 파일이 생성된다. 
abi (----의 약자)

7. truffle(develop)> web3.eth.accounts  //testing 계정 확인

#### 인강 - 코드 수정 이후
- 가나슈 미리 열어놓기
- 코드 수정후 재 컴파일
truffle migrate --compile-all --reset --network ganache

- npm run dev 실행
- metamask 연결

- issue 존재
Attempting to run transaction which calls a contract function, but recipient address is not a contract address

