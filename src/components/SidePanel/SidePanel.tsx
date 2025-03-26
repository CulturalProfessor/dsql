import { Button, CloseButton, Drawer, Portal, VStack } from "@chakra-ui/react";
import { useQueryContext } from "@/context";
import { History } from "lucide-react";

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
              <VStack align="stretch">
                {pastQueries.length == 0
                  ? "No past Queries!"
                  : pastQueries.map((query, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setQuery(query)}
                      >
                        {query}
                      </Button>
                    ))}
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
