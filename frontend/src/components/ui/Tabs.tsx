import { FC, ReactNode, ReactElement, useState } from "react";
import styles from "./Tabs.module.css";

interface TabsProps {
  tabs?: any;
  defaultTab?: any;
  onChange?: any;
}

/**
 * Tabs
 *
 * Props:
 * - tabs       → array of { key, label, icon?, count?, disabled?, content }
 * - defaultTab → key tab yang aktif default (default: tab pertama)
 * - onChange   → (key) => void — callback saat tab berganti
 *
 * Contoh:
 * tabs={[
 *   { key: 'overview', label: 'Overview',  content: <Overview /> },
 *   { key: 'users',    label: 'Users',     count: 24, content: <Users /> },
 *   { key: 'settings', label: 'Settings',  icon: <Settings size={14} />, content: <Settings /> },
 * ]}
 */
const Tabs: FC<TabsProps> = ({ tabs = [], defaultTab, onChange }) => {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.key);

  const handleClick = (key) => {
    setActive(key);
    onChange?.(key);
  };

  const activeTab = tabs.find((t) => t.key === active);

  return (
    <div className={styles.wrapper}>
      {/* Tab list */}
      <div className={styles.list} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={active === tab.key}
            aria-controls={`panel-${tab.key}`}
            id={`tab-${tab.key}`}
            disabled={tab.disabled}
            className={`${styles.tab} ${active === tab.key ? styles.tabActive : ""}`}
            onClick={() => !tab.disabled && handleClick(tab.key)}
          >
            {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span className={styles.tabCount}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Panel */}
      {activeTab && (
        <div
          className={styles.panel}
          role="tabpanel"
          id={`panel-${activeTab.key}`}
          aria-labelledby={`tab-${activeTab.key}`}
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
};

export default Tabs;
