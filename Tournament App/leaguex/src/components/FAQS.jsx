import React, { useState } from "react";

const faqs = [
    {
        question: "How do I join a tournament?",
        answer:
            "Simply create an account, go to the 'Tournaments' page, browse available tournaments, and click 'Join'. You’ll be added once registration is confirmed.",
    },
    {
        question: "How can I create a team?",
        answer:
            "Go to the 'Teams' section, click 'Create Team', fill in your team’s name, logo, and preferences, and invite players to join.",
    },
    {
        question: "Is LeagueX free to use?",
        answer:
            "Yes! LeagueX is completely free for players and teams. Premium features may be added in the future, but core functions will remain free.",
    },
    {
        question: "How can I contact support?",
        answer: "You can reach us on Facebook or Instagram (Private Account) by clicking the link under the footer."
    }
];

const FAQs = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bg-white text-gray-900 py-16 px-6 md:px-24">
            <h2 className="text-3xl font-extrabold text-center mb-2">
                Frequently Asked Questions
            </h2>
            <p className="text-center text-gray-600 mb-10">
                Have a question? We're here to help.
            </p>
            <div className="max-w-3xl mx-auto space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="bg-gray-100 border border-gray-300 rounded-lg px-6 py-4 cursor-pointer transition hover:shadow"
                        onClick={() => toggle(index)}
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg">{faq.question}</h3>
                            <span className="text-xl">{openIndex === index ? "−" : "+"}</span>
                        </div>
                        {openIndex === index && (
                            <p className="text-gray-700 mt-3">{faq.answer}</p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQs;
