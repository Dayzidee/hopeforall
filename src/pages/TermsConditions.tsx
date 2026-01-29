import { Link } from 'react-router-dom';
import { AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';

export default function TermsConditions() {
    return (
        <div className="bg-neutral-50 min-h-screen pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">

                {/* Header */}
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-neutral-100 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-neutral-100 pb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-primary mb-2">Terms and Conditions</h1>
                            <p className="text-neutral-500">Last Updated: January 2026</p>
                        </div>
                        <Link to="/" className="text-accent-teal font-bold hover:underline">
                            &larr; Return Home
                        </Link>
                    </div>

                    <div className="prose prose-lg text-neutral-600 max-w-none">

                        {/* General Participation */}
                        <section className="mb-10">
                            <h3 className="text-2xl font-montserrat font-bold text-primary mb-4">General Participation</h3>
                            <p>
                                By attending, registering for, or participating in any service, event, activity, or program hosted by The Chosen Vessel Church, you agree to these Terms and Conditions. If you do not agree, you should not attend or participate.
                            </p>
                            <p className="mt-4">
                                Participation is voluntary. You assume all risks associated with attendance, including but not limited to personal injury, loss of personal property, or exposure to illness.
                            </p>
                        </section>

                        {/* Code of Conduct */}
                        <section className="mb-10">
                            <h3 className="text-2xl font-montserrat font-bold text-primary mb-4">Code of Conduct</h3>
                            <p>
                                All attendees are expected to conduct themselves in a respectful and lawful manner. The Chosen Vessel Church reserves the right to remove any individual whose behavior is disruptive, unsafe, or inconsistent with the values and mission of the church.
                            </p>
                        </section>

                        {/* Children and Minors */}
                        <section className="mb-10">
                            <h3 className="text-2xl font-montserrat font-bold text-primary mb-4">Children and Minors</h3>
                            <p>
                                Parents and legal guardians are responsible for the supervision and conduct of minors in their care unless the child is formally checked into an approved church program.
                            </p>
                            <p className="mt-4 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 text-blue-800 text-base">
                                By attending with a minor, you represent that you have the legal authority to consent on their behalf.
                            </p>
                        </section>

                        {/* Photo & Media Release */}
                        <section className="mb-10">
                            <h3 className="text-2xl font-montserrat font-bold text-primary mb-4">Photo & Media Release</h3>
                            <p>
                                By attending or participating in this event, you grant The Chosen Vessel Church permission to photograph, record, and otherwise capture your image, likeness, voice, and any minor in your care for ministry and promotional purposes. This includes, but is not limited to, use in print materials, social media, websites, livestreams, and other digital platforms.
                            </p>

                            <div className="bg-neutral-50 p-6 rounded-xl my-6">
                                <p className="font-bold text-primary mb-4">You acknowledge and agree that:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-accent-teal mt-0.5" />
                                        <span>No compensation will be provided for the use of such media</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-accent-teal mt-0.5" />
                                        <span>All photos, videos, and recordings become the property of The Chosen Vessel Church</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-accent-teal mt-0.5" />
                                        <span>You waive any right to inspect or approve the final content or its use</span>
                                    </li>
                                </ul>
                            </div>

                            <p>
                                By registering for or attending this event, you confirm that you have the authority to grant this permission for yourself and any minor in your care. Registration and participation may include: Photography, Video recording, Livestreaming or broadcast, Social media and website publication.
                            </p>
                        </section>

                        {/* Intellectual Property */}
                        <section className="mb-10">
                            <h3 className="text-2xl font-montserrat font-bold text-primary mb-4">Intellectual Property</h3>
                            <p>
                                All content, recordings, logos, sermons, media, and materials produced or distributed by The Chosen Vessel Church are the property of the church and may not be copied, reproduced, or distributed without prior written permission.
                            </p>
                        </section>

                        {/* Limitation of Liability */}
                        <section className="mb-10">
                            <h3 className="text-2xl font-montserrat font-bold text-primary mb-4">Limitation of Liability</h3>
                            <p>
                                To the fullest extent permitted by law, The Chosen Vessel Church is not responsible for any indirect, incidental, or consequential damages arising from attendance or participation in church activities.
                            </p>
                        </section>

                        {/* Impersonation Warning */}
                        <section className="mb-12">
                            <div className="bg-red-50 border-l-4 border-red-500 p-6 md:p-8 rounded-r-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <ShieldAlert className="w-8 h-8 text-red-600" />
                                    <h3 className="text-2xl font-montserrat font-bold text-red-700 m-0">Impersonation, Fraud, and Scam Warning</h3>
                                </div>

                                <div className="text-red-900 space-y-4">
                                    <p>
                                        Bishop Marvin L. Sapp has been the subject of impersonators, fake social media pages, and fraudulent dating and messaging schemes for nearly a decade. These scams continue to spread rapidly despite ongoing efforts to remove them.
                                    </p>
                                    <p>
                                        The Chosen Vessel Church and Bishop Sapp’s office work directly with social media platforms to shut down fraudulent accounts. Unfortunately, technology has made it easier for scammers to create convincing and harmful schemes that prey on unsuspecting individuals. This causes significant stress to Bishop Sapp, his family, and the church, and it is equally distressing when individuals are victimized.
                                    </p>

                                    <div className="bg-white/60 p-6 rounded-lg my-6">
                                        <h4 className="font-bold text-red-700 text-lg mb-4 flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5" /> Important Notice
                                        </h4>
                                        <p className="mb-4 font-medium">Bishop Marvin L. Sapp, his children, and The Chosen Vessel Church do not contact individuals directly for any reason via:</p>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 font-medium">
                                            <li>• Social media direct messages</li>
                                            <li>• Text messages</li>
                                            <li>• Phone calls</li>
                                            <li>• Emails</li>
                                            <li>• Dating sites</li>
                                            <li>• Fan pages</li>
                                        </ul>
                                        <p className="font-bold">Neither Bishop Sapp nor his ministry is affiliated with any fan page of any kind.</p>
                                    </div>

                                    <p>
                                        If you receive any communication claiming to be from Bishop Marvin L. Sapp or on his behalf, it is an impersonator. <strong>Do not respond. Do not engage. Do not provide personal or financial information.</strong>
                                    </p>
                                    <p>
                                        If anyone claims they need your information so money can be sent to you, including fake checks or transfers, this is a scam.
                                    </p>

                                    <h4 className="font-bold text-red-700 text-lg mt-8 mb-4">If you believe you are a victim of a scam:</h4>
                                    <ol className="list-decimal pl-5 space-y-2 mb-6">
                                        <li>Stop all contact with the scammer and block all phone numbers, messages, and email addresses</li>
                                        <li>Keep copies of all communications</li>
                                        <li>Report the account to the social media platform involved (Facebook, Instagram, X, YouTube, etc.)</li>
                                        <li>Report the incident to your local police department</li>
                                        <li>File a complaint with the FBI’s Internet Crime Complaint Center at <a href="https://www.ic3.gov/complaint/default.aspx" target="_blank" rel="noopener noreferrer" className="underline text-red-700 font-bold hover:text-red-900">https://www.ic3.gov</a></li>
                                        <li>Report the matter to the Federal Trade Commission</li>
                                    </ol>

                                    <div className="bg-white p-6 rounded-lg border border-red-100 text-sm">
                                        <p className="font-bold text-gray-900 mb-1">Federal Trade Commission</p>
                                        <p className="text-gray-700">Consumer Response Center</p>
                                        <p className="text-gray-700">600 Pennsylvania Avenue NW</p>
                                        <p className="text-gray-700">Washington, DC 20580</p>
                                        <p className="text-gray-700 mt-2"><span className="font-bold">Phone:</span> (877) 382-4357</p>
                                        <p className="text-gray-700"><span className="font-bold">TTY:</span> (866) 653-4261</p>
                                        <p className="text-gray-700 mt-1"><a href="http://www.ftccomplaintassistant.gov" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-600">www.ftccomplaintassistant.gov</a></p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="text-center bg-accent-teal/10 p-8 rounded-xl">
                            <p className="font-medium text-primary">
                                If you wish to follow Bishop Marvin L. Sapp on social media, please use only the official links provided on this website. Please remain vigilant and safe.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
