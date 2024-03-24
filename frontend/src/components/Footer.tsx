import { HeartIcon } from "@radix-ui/react-icons";

const Footer = () => {
    return (
        <footer className="bg-[#0c0b0e] py-12">
            <div className="mx-auto flex w-11/12 max-w-[1110px] flex-col items-center">
                <div>
                    <a
                        href="https://twitter.com/pacelliv3"
                        className=" text-[#7f63ef] hover:text-[#6751c2]"
                    >
                        Twitter
                    </a>
                    <span className="ml-3 mr-3">|</span>
                    <a
                        href="https://github.com/pacelliv/fund-me-demo"
                        className="text-[#7f63ef] hover:text-[#6751c2]"
                    >
                        GitHub
                    </a>
                </div>
                <p className="mt-3 flex items-center">
                    Made with <HeartIcon className="ml-2" />
                </p>
            </div>
        </footer>
    );
};

export default Footer;
