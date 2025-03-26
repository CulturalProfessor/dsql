import {
  Button,
  CloseButton,
  Drawer,
  Portal,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useQueryContext } from "@/utils/context";
import { History } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
const MAX_QUERY_LENGTH = 30;

const SidePanel = ({ setQuery }: { setQuery: (query: string) => void }) => {
  const { pastQueries } = useQueryContext();

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button variant="outline" size="sm">
          <History size={18} />
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Past Queries</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <VStack align="stretch" maxHeight="800px" overflowY="auto">
                {pastQueries.length === 0 ? (
                  <Text color="gray.500">No past queries!</Text>
                ) : (
                  pastQueries.map((query, index) => {
                    const truncatedQuery =
                      query.length > MAX_QUERY_LENGTH
                        ? `${query.slice(0, MAX_QUERY_LENGTH)}...`
                        : query;

                    return (
                      <Tooltip key={index} content={query}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuery(query)}
                          textAlign="left"
                          width="full"
                          maxWidth="100%"
                        >
                          <Text width="full">{truncatedQuery}</Text>
                        </Button>
                      </Tooltip>
                    );
                  })
                )}
              </VStack>
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default SidePanel;
