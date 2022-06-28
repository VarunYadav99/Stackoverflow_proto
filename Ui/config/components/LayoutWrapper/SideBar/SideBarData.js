import { ReactComponent as GlobalIcon } from '../../../assets/Globe.svg';

export const SideBarData = [
  {
    link: '/questions',
    icon: <GlobalIcon className='icon' />,
    text: 'Stack Overflow',
  },
  {
    link: '/tags',
    text: 'Tags',
  },
  {
    link: '/users',
    text: 'Users',
  },
  {
    link: '/jobs',
    text: 'Jobs',
  }
]


export const SideBarAdminData = [
  {
    link: '/tag/create',
    text: 'Create Tag',
  },
  {
    link: '/review/questions',
    text: 'Review Questions',
  }
]
