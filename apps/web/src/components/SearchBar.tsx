import { Input, Button, ButtonGroup, Tooltip } from "@nextui-org/react";
import { useState, useCallback, useEffect } from "react";
import { SearchIcon } from "./SearchIcon";
import { defaultKeywords, defaultSearchMode } from "@web/utils/env";
import { useSearchStore } from "@web/store/searchStore";

export type SearchMode = "AND" | "OR";

export interface SearchBarProps {
  onSearch: (keywords: string[], mode: SearchMode) => void;
  onDeduplicateChange: (deduplicate: boolean) => void;
  className?: string;
}

export const SearchBar = ({ onSearch, onDeduplicateChange, className = "" }: SearchBarProps) => {
  // 将关键词数组转换为输入字符串
  const keywordsToString = (keywords: string[]) => {
    return keywords.map(keyword => `"${keyword}"`).join(" ");
  };

  const [searchInput, setSearchInput] = useState(keywordsToString(defaultKeywords));
  const [searchMode, setSearchMode] = useState<SearchMode>(defaultSearchMode as SearchMode);
  const { deduplicate } = useSearchStore();

  // 在组件加载时触发一次搜索
  useEffect(() => {
    if (defaultKeywords.length > 0) {
      onSearch(defaultKeywords, searchMode);
    }
  }, []);

  // 解析搜索关键词
  const parseKeywords = (input: string): string[] => {
    const regex = /"([^"]+)"/g;
    const matches = Array.from(input.matchAll(regex));
    return matches.map(match => match[1]);
  };

  // 处理搜索
  const handleSearch = useCallback(() => {
    const keywords = parseKeywords(searchInput);
    onSearch(keywords, searchMode);
  }, [searchInput, searchMode, onSearch]);

  // 处理输入变化
  const handleInputChange = (value: string) => {
    setSearchInput(value);
  };

  // 切换搜索模式
  const toggleSearchMode = () => {
    const newMode = searchMode === "AND" ? "OR" : "AND";
    setSearchMode(newMode);
    // 当切换模式时，如果有关键词则立即触发搜索
    const keywords = parseKeywords(searchInput);
    if (keywords.length > 0) {
      onSearch(keywords, newMode);
    }
  };

  // 切换去重状态
  const toggleDeduplicate = () => {
    onDeduplicateChange(!deduplicate);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Input
        value={searchInput}
        onValueChange={handleInputChange}
        placeholder='输入 "关键词1" "关键词2" ...'
        startContent={<SearchIcon />}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <ButtonGroup>
        <Button
          color="primary"
          variant={searchMode === "AND" ? "solid" : "bordered"}
          onClick={toggleSearchMode}
        >
          AND
        </Button>
        <Button
          color="primary"
          variant={searchMode === "OR" ? "solid" : "bordered"}
          onClick={toggleSearchMode}
        >
          OR
        </Button>
        <Tooltip content="去除重复标题">
          <Button
            color="primary"
            variant={deduplicate ? "solid" : "bordered"}
            onClick={toggleDeduplicate}
          >
            去重
          </Button>
        </Tooltip>
      </ButtonGroup>
    </div>
  );
};
