import { Box } from "@chakra-ui/layout";
import { ChakraProvider } from "@chakra-ui/react";
import { useState } from "react";
import Chatbox from "../../components/Chat/Chatbox";
import MyChats from "../../components/Chat/MyChats";
import SideDrawer from "../../components/Chat/Other/SideDrawer";
import { ChatState } from "../../context/ChatProvider";


const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <ChakraProvider>
    <div style={{ width: "100%"}}>
      {/* {user && <SideDrawer />} */}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="75px 10px 10px 10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
    </ChakraProvider>
  );
};

export default Chatpage;
