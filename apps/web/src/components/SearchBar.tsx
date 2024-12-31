import { Input, Button, ButtonGroup } from "@nextui-org/react";
import { useState, useCallback } from "react";
import { SearchIcon } from "./SearchIcon";

export type SearchMode = "AND" | "OR";

export interface SearchBarProps {
  onSearch: (keywords: string[], mode: SearchMode) => void;
  className?: string;
}

export const SearchBar = ({ onSearch, className = "" }: SearchBarProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("AND");

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
    setSearchMode(prev => prev === "AND" ? "OR" : "AND");
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
      </ButtonGroup>
    </div>
  );
};
