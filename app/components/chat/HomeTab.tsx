import React from 'react';
import { chatMetadata } from '~/lib/persistence';
import { classNames } from '~/utils/classNames';

const TAB_DATA = [
  {
    tabId: 'tab1',
    title: 'Device Panel Generation',
    appType: 'device',
    promptId: 'dcmPrompt',
    content: [
      'Describe the device you want to create (medical, industrial, consumer, etc.)',
      'Specify the screen size and resolution if needed',
      'Mention any specific UI components you want (buttons, sliders, graphs)',
      'Describe the functionality and interactions for each element',
      'Include any brand guidelines or color preferences',
      'Specify if you need responsive design for different screen sizes',
    ],
  },
  {
    tabId: 'tab2',
    title: 'Instrument Panel Generation',
    appType: 'instrument',
    promptId: 'ipmPrompt',
    content: [
      'Describe the type of instrument panel (aviation, automotive, marine, etc.)',
      'Specify the layout and arrangement of gauges and displays',
      'Mention any specific instruments or indicators needed',
      'Include color schemes and branding guidelines',
      'Specify if you need interactive elements or animations',
    ],
  },
];

export const HomeTabs = React.forwardRef(function HomeTabs({ chatStarted }: { chatStarted: boolean }) {
  const [activeTab, setActiveTab] = React.useState<string | null>(null);
  const appType = chatMetadata.get()?.appType;

  const handleTabChange = (tab: string) => {
    const newAppType = TAB_DATA.find((item) => item.tabId === tab)?.appType;
    const newPromptId = TAB_DATA.find((item) => item.tabId === tab)?.promptId;

    if (activeTab === tab) {
      setActiveTab(null);
      chatMetadata.set({
        appType: 'default',
        promptId: 'default',
      });
    } else {
      setActiveTab(tab);
      chatMetadata.set({
        appType: newAppType,
        promptId: newPromptId,
      });
    }
  };

  const toggleAccordion = (tab: string) => {
    if (activeTab === tab) {
      setActiveTab(null);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col items-center px-4">
        <div className="flex gap-4 mt-6 w-full max-w-chat">
          {chatStarted && (
            <div className="w-full bg-white rounded-lg shadow-sm">
              {TAB_DATA.map(
                (tab) =>
                  appType === tab.appType && (
                    <div key={tab.tabId}>
                      <button
                        className="w-full text-left px-4 py-3 flex justify-between items-center border border-bolt-elements-borderColor shadow-sm rounded-lg bg-white hover:bg-gray-50 focus:outline-none "
                        onClick={() => toggleAccordion(tab.tabId)}
                      >
                        <span className="text-md font-medium">{tab.title}</span>
                        <span className="text-xl">{activeTab === tab.tabId ? '-' : '+'}</span>
                      </button>
                    </div>
                  ),
              )}
            </div>
          )}
          {!chatStarted &&
            TAB_DATA.map((tab) => (
              <div
                key={tab.tabId}
                className={classNames(
                  'px-6 py-2 rounded-lg font-medium transition-all border border-bolt-elements-borderColor cursor-pointer',
                  'hover:bg-bolt-elements-background-depth-3',
                  activeTab === tab.tabId
                    ? 'bg-bolt-elements-background-depth-3 text-bolt-elements-textPrimary'
                    : 'bg-bolt-elements-background-depth-1 text-bolt-elements-textSecondary',
                )}
                onClick={() => handleTabChange(tab.tabId)}
              >
                {tab.title}
              </div>
            ))}
        </div>
      </div>

      <div className="w-full max-w-chat">
        {TAB_DATA.map(
          (tab) =>
            activeTab === tab.tabId && (
              <div className="animate-fade-in">
                <div className="bg-bolt-elements-background-depth-2 p-6 rounded-xl border border-bolt-elements-borderColor mb-4 mt-4">
                  <h2 className="text-xl font-semibold mb-4 text-bolt-elements-textPrimary">
                    {tab.title} Creation Instructions
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-bolt-elements-textSecondary">
                    {tab.content.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ),
        )}
      </div>
    </>
  );
});
