import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { CreatePhraseForm } from './create-phrase-form';

interface CreatePhraseProps {
	defaultCategoryId: string;
}

export const CreatePhrase: React.FC<CreatePhraseProps> = ({
	defaultCategoryId,
}) => {
	return (
		<Accordion
			type="single"
			collapsible
			className="border border-border rounded-md px-4 pt-2 bg-component-light dark:bg-component-dark"
		>
			<AccordionItem value="item-1">
				<AccordionTrigger>
					<h3 className="mb-3 text-base font-semibold text-black dark:text-white">
						Добавить фразу
					</h3>
				</AccordionTrigger>
				<AccordionContent>
					<CreatePhraseForm defaultCategoryId={defaultCategoryId} />
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};
