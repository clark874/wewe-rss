import {
  Badge,
  Image,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Tooltip,
} from '@nextui-org/react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { GitHubIcon } from './GitHubIcon';
import { useLocation } from 'react-router-dom';
import { appVersion, serverOriginUrl } from '@web/utils/env';
import { useEffect, useState } from 'react';
import { SearchBar } from './SearchBar';
import { useSearchStore } from '@web/store/searchStore';

const navbarItemLink = [
  {
    href: '/feeds',
    name: '公众号源',
  },
  {
    href: '/accounts',
    name: '账号管理',
  },
];

const Nav = () => {
  const { pathname } = useLocation();
  const [releaseVersion, setReleaseVersion] = useState(appVersion);
  const { setKeywords, setSearchMode, setDeduplicate } = useSearchStore();

  useEffect(() => {
    fetch('https://api.github.com/repos/cooderl/wewe-rss/releases/latest')
      .then((res) => res.json())
      .then((data) => {
        setReleaseVersion(data.name.replace('v', ''));
      });
  }, []);

  const isFoundNewVersion = releaseVersion > appVersion;

  const handleSearch = (keywords: string[], mode: "AND" | "OR") => {
    setKeywords(keywords);
    setSearchMode(mode);
  };

  const handleDeduplicateChange = (deduplicate: boolean) => {
    setDeduplicate(deduplicate);
  };

  return (
    <div>
      <Navbar isBordered>
        <Tooltip
          content={
            <div className="p-1">
              {isFoundNewVersion && (
                <Link
                  href={`https://github.com/cooderl/wewe-rss/releases/latest`}
                  target="_blank"
                  className="mb-1 block text-medium"
                >
                  发现新版本：v{releaseVersion}
                </Link>
              )}
              当前版本: v{appVersion}
            </div>
          }
          placement="left"
        >
          <NavbarBrand className="cursor-default">
            <Badge
              content={isFoundNewVersion ? '' : null}
              color="danger"
              size="sm"
            >
              <Image
                width={28}
                alt="WeWe RSS"
                className="mr-2"
                src={
                  serverOriginUrl
                    ? `${serverOriginUrl}/favicon.ico`
                    : 'https://r2-assets.111965.xyz/wewe-rss.png'
                }
              />
            </Badge>
            <p className="font-bold text-inherit">WeWe RSS</p>
          </NavbarBrand>
        </Tooltip>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {pathname.startsWith('/feeds') && (
            <NavbarItem>
              <SearchBar
                className="w-[400px]"
                onSearch={handleSearch}
                onDeduplicateChange={handleDeduplicateChange}
              />
            </NavbarItem>
          )}
          {navbarItemLink.map((item) => (
            <NavbarItem
              isActive={pathname.startsWith(item.href)}
              key={item.href}
            >
              <Link color="foreground" href={item.href}>
                {item.name}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end">
          <ThemeSwitcher />
          <Link
            href="https://github.com/cooderl/wewe-rss"
            target="_blank"
            color="foreground"
          >
            <GitHubIcon />
          </Link>
        </NavbarContent>
      </Navbar>
    </div>
  );
};

export default Nav;
