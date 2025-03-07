import { IconContext } from "react-icons";
import * as si from "react-icons/si";
import * as md from "react-icons/md";
import { preact } from "lume/deps/preact.ts";
import { twMerge } from "npm:tailwind-merge";

const Item: preact.FunctionComponent<{ href?: string; className?: string }> = (
    { href, className, children },
) => (
    <li>
        <a
            href={href}
            className={twMerge(
                `flex w-fit flex-row items-center gap-1.5 rounded-lg px-2 py-1
                transition-colors hover:bg-zinc-900 hover:text-zinc-200
                hover:dark:bg-zinc-200 hover:dark:text-zinc-900`,
                className,
            )}
        >
            {children}
        </a>
    </li>
);

export const title = "Home";
export const layout = "layout.tsx";

export default () => {
    return (
        <div className="mx-auto my-auto">
            <div className="flex flex-col items-center mx-8">
                <div className="flex items-center gap-2">
                    <img
                        className="size-48 aspect-square rounded-full object-cover overflow-hidden"
                        width="200"
                        alt="my face drawn by myself"
                        src="/img/face.png"
                        transform-images="webp 300"
                    />
                    <IconContext.Provider value={{ size: "1.25em" }}>
                        <ul className="flex flex-col max-w-full gap-1">
                            {[
                                {
                                    url: "https://github.com/levydsa",
                                    icon: <si.SiGithub />,
                                    text: "@levydsa",
                                },
                                {
                                    url: "https://twitter.com/levyddsa",
                                    icon: <si.SiX />,
                                    text: "@levyddsa",
                                },
                                {
                                    url: "https://linkedin.com/in/levy-albuquerque",
                                    icon: <si.SiLinkedin />,
                                    text: "@levy-albuquerque",
                                },
                                {
                                    href: "mailto:me@levy.lat",
                                    icon: <md.MdAlternateEmail />,
                                    text: "me@levy.lat",
                                },
                            ].map(({ url, icon, text }) => (
                                <Item href={url}>
                                    {icon}
                                    <span className="hidden sm:block">
                                        {text}
                                    </span>
                                </Item>
                            ))}
                        </ul>
                    </IconContext.Provider>
                </div>
                <main className="max-w-[60ch] mt-4 text-justify hyphens-auto">
                    <h2 className="text-xl font-medium">About</h2>
                    <p className="mt-1">
                        Hi! My name is{" "}
                        <abbr title="[levi]">Levy</abbr>. I'm a software
                        developer from Brazil mainly focused on low level
                        programming, but interested on everything around math
                        and engineering.
                    </p>
                </main>
                <nav className="self-start">
                    <ul className="flex gap-1 mt-4">
                        <Item href="/resume">
                            <md.MdOutlineLibraryBooks />Resume
                        </Item>
                    </ul>
                </nav>
            </div>
        </div>
    );
};
