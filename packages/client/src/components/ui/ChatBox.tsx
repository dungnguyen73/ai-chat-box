import { Button } from './button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

type FormData = {
    prompt: string;
};

const ChatBox = () => {
    const { register, handleSubmit, reset, formState } = useForm<FormData>();

    const onSubmit = (data: FormData) => {
        console.log(data);
        reset();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={handleKeyDown}
            className="flex flex-col gap-2 items-end border-2 p-4 border-gray-600 rounded-2xl"
        >
            <textarea
                {...register('prompt', {
                    required: true,
                    validate: (data) => data.trim().length > 0,
                    maxLength: 1000,
                })}
                className="w-full p-4 focus:ring-0 outline-none"
                placeholder="Type your message here..."
            />
            <Button
                type="submit"
                disabled={!formState.isValid}
                className="rounded-full w-9 h-9"
            >
                <FaArrowUp />
            </Button>
        </form>
    );
};

export default ChatBox;
