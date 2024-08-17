import { PageProps } from "@app/http/server/types.ts";
import { Footer } from "@app/components/footer.tsx";
import Header from "@app/components/header.tsx";
import Launchpad from "@app/modules/index/index.launchpad.tsx";
import NonLogin from "@app/modules/index/index.non-login.tsx";

export default function Index({ data }: PageProps<
  {
    user: string;
    title: string;
    description: string;
    baseUrl: string;
    new: string;
    destination: string;
    isLogin: boolean;
    avatar_url: string;
    html_url: string;
  }
>) {
  return (
    <>
      <Header
        isLogin={data.isLogin}
        avatar_url={data.avatar_url}
        html_url={data.html_url}
        title={data.isLogin ? "Launchpad" : "Fastro"}
      />

      {data.isLogin &&
        (
          <section class="container flex flex-col gap-y-12 grow max-w-4xl mx-auto text-center">
            <Launchpad />
          </section>
        )}

      {!data.isLogin && <NonLogin data={data} />}

      <Footer />
    </>
  );
}
