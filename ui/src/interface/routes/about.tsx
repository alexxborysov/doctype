import { Image } from '@mantine/core';

export const About = () => {
  return (
    <main className="flex flex-col w-full px-4 lg:px-8 mt-3 items-center justify-center h-fit">
      <section className="max-w-3xl text-left items-start pb-20">
        <h3 className="mb-4 text-2xl font-demi text-primary">
          Progressive web tool designed for seamless note-taking and enhanced productivity.
        </h3>
        <ul className="space-y-2 text-left">
          <li className="text-lg text-zinc-300">
            <span className="font-medium mr-[1px]">•</span> Keyboard shortcuts to improve
            efficiency.
          </li>
          <li className="text-lg text-zinc-300">
            <span className="font-medium mr-[1px]">•</span> The ability to work offline or in
            unstable network conditions.
          </li>
          <li className="text-lg text-zinc-300">
            <span className="font-medium mr-[1px]">•</span> No need for authorization to get
            started.
          </li>
          <li className="text-lg text-zinc-300">
            <span className="font-medium mr-[1px]">•</span> Installable web-app for
            <a
              target="_blank"
              href="https://support.apple.com/en-hk/104996"
              className="text-blue-500 hover:underline mx-1 underline-offset-2"
            >
              Safari
            </a>
            and
            <a
              target="_blank"
              href="https://support.google.com/chrome/answer/9658361?hl=en&co=GENIE.Platform%3DDesktop"
              className="text-blue-500 hover:underline mx-1 underline-offset-2"
            >
              Chrome.
            </a>
            <Image
              src="/images/installed-app.webp"
              alt="installed-app"
              w="auto"
              fit="contain"
              className="h-[270px] sm:h-[440px] md:h-[522px]"
            />
          </li>
        </ul>
        <p className="text-lg text-zinc-300 mb-3">So that you can access the app faster.</p>

        <p className="text-lg text-zinc-300">
          The application is currently under development. If you encounter any issues, feel free
          to
          <a
            target="_blank"
            href="mailto:alexborysovdev@gmail.com"
            className="text-blue-500 hover:underline mx-1 underline-offset-2"
          >
            email
          </a>
          or
          <a
            target="_blank"
            href="https://github.com/alexphloyd/doctype/issues"
            className="text-blue-500 hover:underline mx-1 underline-offset-2"
          >
            create an issue
          </a>
          on GitHub.
        </p>
      </section>
    </main>
  );
};
