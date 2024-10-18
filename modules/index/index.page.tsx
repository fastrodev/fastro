import { PageProps } from "../../core/server/types.ts";
import { Footer } from "@app/components/footer.tsx";
import Header from "@app/components/header.tsx";
import Launchpad from "@app/modules/index/index.launchpad.tsx";
import NonLogin from "@app/modules/index/index.non-login.tsx";
import {
  AppContext,
  createAppState,
} from "@app/modules/index/index.context.ts";

export default function Index({ data }: PageProps<
  {
    username: string;
    title: string;
    description: string;
    baseUrl: string;
    new: string;
    destination: string;
    isLogin: boolean;
    avatar_url: string;
    html_url: string;
    ws_url: string;
  }
>) {
  return (
    <AppContext.Provider value={createAppState()}>
      <div class={`h-full flex flex-col justify-between`}>
        {data.isLogin && (
          <Launchpad
            avatar_url={data.avatar_url}
            username={data.username}
            ws_url={data.ws_url}
          />
        )}

        {!data.isLogin && (
          <>
            <Header
              isLogin={data.isLogin}
              avatar_url={data.avatar_url}
              html_url={data.html_url}
              title={data.isLogin ? "Launchpad" : "Fastro"}
            />
            <NonLogin data={data} />
            <Footer />
          </>
        )}
      </div>
    </AppContext.Provider>
  );
}
