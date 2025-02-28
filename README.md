# [Goopa](https://goopa.nara.dev)

![Goopa Logo](./public/images/goopa-logo.png)

## Introduction / 소개

Goopa is a web application designed to streamline the process of setting up and customizing your MacBook. It serves as a centralized platform where users can store and manage their preferred app configurations and tool settings.

Goopa는 MacBook 설정 및 커스터마이징 과정을 간소화하기 위해 설계된 웹 애플리케이션입니다. 사용자가 선호하는 앱 구성과 도구 설정을 저장하고 관리할 수 있는 중앙 집중식 플랫폼 역할을 합니다.

The key features of Goopa include:
Goopa의 주요 기능은 다음과 같습니다:

- Saving personal MacBook setup preferences / 개인 MacBook 설정 환경설정 저장
- Storing configurations for frequently used apps and tools / 자주 사용하는 앱 및 도구의 구성 저장
- Sharing setup profiles with other users / 다른 사용자와 설정 프로필 공유

This project aims to simplify the often time-consuming task of configuring a new MacBook or reconfiguring after a system reset. By allowing users to save and share their setups, Goopa creates a community-driven resource for optimal MacBook configurations.

이 프로젝트는 새로운 MacBook을 구성하거나 시스템 재설정 후 재구성하는 시간이 많이 소요되는 작업을 단순화하는 것을 목표로 합니다. 사용자가 자신의 설정을 저장하고 공유할 수 있게 함으로써, Goopa는 최적의 MacBook 구성을 위한 커뮤니티 기반 리소스를 만듭니다.

Developed using Next.js, React, and Tailwind CSS, Goopa offers user-friendly interface to manage your MacBook setup efficiently.

Next.js, React 및 Tailwind CSS를 사용하여 개발된 Goopa는 MacBook 설정을 효율적으로 관리할 수 있는 사용자 친화적인 인터페이스를 제공합니다.

## Tech Stack / 기술 스택

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [React Query](https://tanstack.com/query/v5/docs/framework/react/overview)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS](https://tailwindcss.com/)

## TODO List / 할 일 목록

- [x] Implement bookmark functionality / 북마크 기능 구현
    - [x] Implement quick access to bookmarked configurations / 북마크된 구성에 빠르게 접근할 수 있는 기능 구현
- [x] Enhance configuration sharing capabilities / 구성 공유 기능 향상
- [ ] Ensure app order preservation / 앱 순서 보존 보장
    - [ ] Create a system to save user-defined app order / 사용자 정의 앱 순서를 저장하는 시스템 생성
    - [ ] Display app list in the saved order / 저장된 순서대로 앱 목록 표시
    - [ ] Allow users to reorder apps easily / 사용자가 쉽게 앱 순서를 변경할 수 있도록 함
- [ ] Expand beyond computer categories / 컴퓨터 카테고리 외 확장

    - [ ] Include categories for non-tech setups (e.g., workspace organization, productivity tools) / 비기술적 설정을 위한 카테고리 포함 (예: 작업 공간 구성, 생산성 도구)
    - [ ] Develop a flexible category system for user-defined setups / 사용자 정의 설정을 위한 유연한 카테고리 시스템 개발

- [ ] Optimize performance / 성능 최적화
- [ ] Improve mobile responsive design / 모바일 반응형 디자인 개선

## Getting Started / 시작하기

### Prerequisites / 전제 조건

- Node.js (version 14 or later / 버전 14 이상)
- npm or yarn / npm 또는 yarn

### Installation / 설치

1. Clone the repository / 저장소 복제:

```
git clone [https://github.com/your-username/goopa.git](https://github.com/your-username/goopa.git)
cd goopa
```

2. Install dependencies / 의존성 설치:

```
npm install
```

or

```
yarn install
```

### Running the Development Server / 개발 서버 실행

```
npm run dev
```

or

```
yarn dev
```

You can now access the application in your browser at `http://localhost:3000`.
이제 브라우저에서 `http://localhost:3000`으로 애플리케이션에 접속할 수 있습니다.

## Building and Deploying / 빌드 및 배포

To create a production build / 프로덕션 빌드 생성:

```
npm run build
```

or

```
yarn build
```

To run the built application / 빌드된 애플리케이션 실행:

```
npm start
```

or

```
yarn start
```

## Contributing / 기여하기

If you'd like to contribute to the project, please submit a pull request. For major changes, it's best to open an issue first to discuss the proposed changes.

프로젝트에 기여하고 싶으시다면 풀 리퀘스트를 제출해 주세요. 주요 변경사항의 경우, 먼저 이슈를 열어 제안된 변경사항에 대해 논의하는 것이 좋습니다.

## Contributors / 기여한 사람들

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://nara.dev"><img src="https://avatars.githubusercontent.com/u/16604401?v=4?s=100" width="100px;" alt="nara"/><br /><sub><b>nara</b></sub></a><br /><a href="#maintenance-narashin" title="Maintenance">🚧</a> <a href="#code-narashin" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://tigeryoo-portfolio.web.app/"><img src="https://avatars.githubusercontent.com/u/6271133?v=4?s=100" width="100px;" alt="Taekwon Yoo"/><br /><sub><b>Taekwon Yoo</b></sub></a><br /><a href="#bug-MTGVim" title="Bug reports">🐛</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License / 라이선스

This project is licensed under the [MIT License](LICENSE).
이 프로젝트는 [MIT 라이선스](LICENSE)하에 있습니다.
