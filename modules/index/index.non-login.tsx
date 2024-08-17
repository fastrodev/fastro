import InlineNav from "@app/components/inline-nav.tsx";
import TailwindSvg from "@app/components/icons/tailwind-svg.tsx";
import PreactSvg from "@app/components/icons/preact-svg.tsx";
import DenoSvg from "@app/components/icons/deno-svg.tsx";
import TypeScriptSvg from "@app/components/icons/ts-svg.tsx";
import ProjectBox from "@app/components/project-box.tsx";
import SeoSvg from "@app/components/icons/seo-svg.tsx";
import BoltSvg from "@app/components/icons/bolt-svg.tsx";
import UxSvg from "@app/components/icons/ux-svg.tsx";
import SettingSvg from "@app/components/icons/setting-svg.tsx";
import ScaleSvg from "@app/components/icons/scale-svg.tsx";
import RepeatSvg from "@app/components/icons/repeat-svg.tsx";
import WwwSvg from "@app/components/icons/www-svg.tsx";

function PoweredBy() {
    return (
        <div class={`flex flex-col gap-y-6 mx-6 md:mx-0`}>
            <h2 class={`text-gray-100 sm:text-2xl text-xl`}>
                High-performance web framework built on a flat, modular
                architecture. Powered by Deno, TypeScript, Preact JS, and
                Tailwind CSS
            </h2>

            <div
                class={`mx-auto max-w-xl flex justify-between gap-x-9`}
            >
                <div class={`text-white h-[100px]`}>
                    <DenoSvg />
                </div>
                <div class={`text-white h-[100px]`}>
                    <TypeScriptSvg />
                </div>
                <div class={`text-white flex items-center h-[100px]`}>
                    <PreactSvg />
                </div>
                <div class={`text-white flex items-center h-[100px]`}>
                    <TailwindSvg />
                </div>
            </div>
        </div>
    );
}

function WhyFlat() {
    return (
        <div class={`flex flex-col gap-6 mx-6`}>
            <h2 class={`text-gray-100 sm:text-2xl text-xl`}>
                Why use a flat modular architecture?
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                <ProjectBox>
                    <BoltSvg width="36px" height="36px" />
                    <p>Rapid Build</p>
                </ProjectBox>
                <ProjectBox>
                    <SettingSvg />
                    <p>Maintainable</p>
                </ProjectBox>
                <ProjectBox>
                    <ScaleSvg />
                    <p>Scalable</p>
                </ProjectBox>
                <ProjectBox>
                    <RepeatSvg />
                    <p>Reusable</p>
                </ProjectBox>
            </div>
        </div>
    );
}

function WhySSR() {
    return (
        <div class={`flex flex-col gap-6 mx-6`}>
            <h2 class={`text-gray-100 sm:text-2xl text-xl`}>
                Why use SSR?
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                <ProjectBox>
                    <BoltSvg width="36px" height="36px" />
                    <p>Quick Load</p>
                </ProjectBox>
                <ProjectBox>
                    <SeoSvg />
                    <p>Improved SEO</p>
                </ProjectBox>
                <ProjectBox>
                    <UxSvg />
                    <p>Better UX</p>
                </ProjectBox>
                <ProjectBox>
                    <WwwSvg />
                    <p>Browser Legacy</p>
                </ProjectBox>
            </div>
        </div>
    );
}

// deno-lint-ignore no-explicit-any
export default function NonLogin(props: { data: any }) {
    const data = props.data;
    return (
        <section class="container flex flex-col gap-y-10 grow max-w-4xl mx-auto text-center">
            <div
                class={`flex flex-col gap-y-6 py-16 bg-gradient-to-r from-gray-950 to-green-800 rounded-2xl`}
            >
                <div class={`text-center`}>
                    <InlineNav
                        title="What's new"
                        description={data.new}
                        destination={`${data.baseUrl}/${data.destination}`}
                    />
                </div>

                <h1 class="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-center text-white">
                    {data.title}
                </h1>

                <div class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4 mx-6 md:mx-0">
                    <a
                        href="/docs/start"
                        class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-900 border border-white"
                    >
                        Get started
                        <svg
                            class="ml-2 -mr-1 w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clip-rule="evenodd"
                            >
                            </path>
                        </svg>
                    </a>
                    <div class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg border text-white border-white bg-black">
                        deno run -A -r https://fastro.dev
                    </div>
                </div>
            </div>

            <PoweredBy />

            <div
                class={`flex flex-col gap-y-12 py-12 rounded-2xl bg-gradient-to-r from-gray-950 to-green-800`}
            >
                <WhySSR />
                <WhyFlat />
            </div>
        </section>
    );
}
