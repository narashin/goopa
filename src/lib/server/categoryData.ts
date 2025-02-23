import { type AppCategoryType, SubCategoryType } from '../../types/category';
import type { ITool } from '../../types/item';

export function getPublicAppsByCategory(category: AppCategoryType): ITool[] {
    return [
        {
            id: '1',
            name: '당신의',
            category: category,
            description:
                '# 마크다운 활용 가능\n\n' +
                '1. 이렇게\n' +
                '2. 저렇게\n\n' +
                '# 당신만의 셋팅을\n\n' +
                '## 모두에게\n\n' +
                '### 자랑해보세요',
            subCategory: SubCategoryType.None,
            userId: 'public',
            installCommand: 'goopa install -g example',
            icon: '',
            url: 'https://example.com/app1',
            starCount: 10,
        },
        {
            id: '2',
            name: '앱 셋팅을',
            category: category,
            description:
                '# 공유 기능을 이용해보세요\n\n' +
                '1. 유저메뉴로 Share를 하면\n' +
                '2. 나만의 링크를 복사할 수 있어요\n' +
                '3. 공유를 멈추면 해당 링크는 만료되어 접근 할 수 없어요',
            subCategory: SubCategoryType.None,
            userId: 'public',
            installCommand: 'goopa install -g example',
            icon: '',
            url: 'https://example.com/app2',
            starCount: 5,
        },
        {
            id: '3',
            name: '자랑해보세요',
            category: category,
            description:
                '# 다른 사람이 공유한 앱이 마음에 든다면\n\n' +
                '* 별표를 눌러주세요\n' +
                '* 별표를 누르면 해당 앱이 당신의 앱 목록에 추가됩니다',
            subCategory: SubCategoryType.None,
            userId: 'public',
            installCommand: 'goopa install -g example',
            icon: '',
            url: 'https://example.com/app2',
            starCount: 3,
        },
        {
            id: '4',
            name: 'goopa',
            category: category,
            description: '# Goopa\n\n쿠파를 짝사랑해서 지은 이름이에요. 💚',
            subCategory: SubCategoryType.None,
            userId: 'public',
            icon: '/icons/goopa-char-outlined-logo.png',
            url: 'https://goopa.nara.dev',
            installCommand: 'goopa install -g goopa',
            starCount: 3,
        },
    ];
}
