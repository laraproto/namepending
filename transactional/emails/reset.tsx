// Email template taken from React Email official templates, 01-Barebones activation.tsx

import {
	Body,
	Button,
	Column,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Row,
	Section,
	Tailwind,
	Text
} from 'react-email';
import { barebonesBoxedTailwindConfig } from './theme';

interface ResetEmailProps {
	url: string;
}

export const ResetEmail = ({ url }: ResetEmailProps) => (
	<Tailwind config={barebonesBoxedTailwindConfig}>
		<Html>
			<Head></Head>
			<Body className="bg-bg-2 m-0 text-center font-sans">
				<Preview>A request to reset your password has been received</Preview>
				<Container className="mobile:mt-0 mx-auto mt-8 w-full max-w-160">
					<Section>
						<Section className="bg-bg mobile:px-2 px-6 py-4">
							<Section className="mb-3 px-6">
								<Row>
									<Column align="right" className="w-1/2 py-1.75 align-middle">
										<Text className="font-13 m-0 text-right font-sans">
											<span className="text-fg-3">Namepending</span>
										</Text>
									</Column>
								</Row>
							</Section>

							<Section className="bg-bg-2 mobile:px-6 mobile:py-12 rounded-[8px] px-10 py-16 text-center">
								<Section className="mb-3">
									<Heading as="h1" className="font-28 text-fg m-0 font-sans">
										Password Reset Request
									</Heading>
								</Section>

								<Text className="font-16 text-fg-2 mx-auto mt-0 mb-8 max-w-95 text-center font-sans">
									A request to reset your password has been received, you can reset it using the
									button below:
								</Text>

								<Section className="mb-6 text-center">
									<Button
										href={url}
										className="bg-fg font-16 text-fg-inverted inline-block rounded-lg px-7 py-4 text-center font-sans leading-6"
									>
										Reset Password
									</Button>
								</Section>
							</Section>
						</Section>
					</Section>
				</Container>
			</Body>
		</Html>
	</Tailwind>
);

ResetEmail.PreviewProps = {
	url: 'https://laratheprotogen.dev'
} satisfies ResetEmailProps;

export default ResetEmail;
