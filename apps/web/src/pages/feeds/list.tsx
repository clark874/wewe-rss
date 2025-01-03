import { FC, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Button,
  Spinner,
  Link,
} from '@nextui-org/react';
import { trpc } from '@web/utils/trpc';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { useSearchStore } from '@web/store/searchStore';

const ArticleList: FC = () => {
  const { id } = useParams();
  const { keywords, searchMode, deduplicate, setDeduplicate } = useSearchStore();

  const mpId = id || '';

  const { data, fetchNextPage, isLoading, hasNextPage } =
    trpc.article.list.useInfiniteQuery(
      {
        limit: 20,
        mpId: mpId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const filteredItems = useMemo(() => {
    const items = data
      ? data.pages.reduce((acc, page) => [...acc, ...page.items], [] as any[])
      : [];

    if (!keywords || keywords.length === 0) {
      // 如果没有搜索关键词，但需要去重
      if (deduplicate) {
        const seen = new Set<string>();
        return items.filter(item => {
          if (seen.has(item.title)) {
            return false;
          }
          seen.add(item.title);
          return true;
        });
      }
      return items;
    }

    // 先根据关键词过滤
    const filtered = items.filter((item) => {
      const title = item.title.toLowerCase();
      if (searchMode === 'AND') {
        return keywords.every(keyword => 
          title.includes(keyword.toLowerCase())
        );
      } else {
        return keywords.some(keyword => 
          title.includes(keyword.toLowerCase())
        );
      }
    });

    // 如果需要去重，对过滤后的结果进行去重
    if (deduplicate) {
      const seen = new Set<string>();
      return filtered.filter(item => {
        if (seen.has(item.title)) {
          return false;
        }
        seen.add(item.title);
        return true;
      });
    }

    return filtered;
  }, [data, keywords, searchMode, deduplicate]);

  return (
    <div>
      <Table
        classNames={{
          base: 'h-full',
          table: 'min-h-[420px]',
        }}
        aria-label="文章列表"
        bottomContent={
          hasNextPage && !isLoading ? (
            <div className="flex w-full justify-center">
              <Button
                isDisabled={isLoading}
                variant="flat"
                onPress={() => {
                  fetchNextPage();
                }}
              >
                {isLoading && <Spinner color="white" size="sm" />}
                加载更多
              </Button>
            </div>
          ) : null
        }
      >
        <TableHeader>
          <TableColumn key="title">标题</TableColumn>
          <TableColumn width={180} key="publishTime">
            发布时间
          </TableColumn>
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          emptyContent={'暂无数据'}
          items={filteredItems || []}
          loadingContent={<Spinner />}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => {
                let value = getKeyValue(item, columnKey);

                if (columnKey === 'publishTime') {
                  value = dayjs(value * 1e3).format('YYYY-MM-DD HH:mm:ss');
                  return <TableCell>{value}</TableCell>;
                }

                if (columnKey === 'title') {
                  return (
                    <TableCell>
                      <Link
                        className="visited:text-neutral-400"
                        isBlock
                        showAnchorIcon
                        color="foreground"
                        target="_blank"
                        href={`https://mp.weixin.qq.com/s/${item.id}`}
                      >
                        {value}
                      </Link>
                    </TableCell>
                  );
                }
                return <TableCell>{value}</TableCell>;
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ArticleList;
